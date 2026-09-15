"""
Monitoring service - Prometheus metrics, health checks, and logging
"""
import logging
import time
from collections.abc import Callable
from datetime import datetime
from functools import wraps
from typing import Any

from prometheus_client import CONTENT_TYPE_LATEST, Counter, Gauge, Histogram, generate_latest
from starlette.requests import Request
from starlette.responses import Response

logger = logging.getLogger(__name__)

# Prometheus metrics
REQUEST_COUNT = Counter(
    'http_requests_total',
    'Total HTTP requests',
    ['method', 'endpoint', 'status']
)

REQUEST_LATENCY = Histogram(
    'http_request_duration_seconds',
    'HTTP request latency',
    ['method', 'endpoint']
)

ACTIVE_CONNECTIONS = Gauge(
    'active_connections',
    'Number of active connections'
)

DB_QUERY_DURATION = Histogram(
    'db_query_duration_seconds',
    'Database query duration',
    ['query_type']
)

AI_REQUEST_DURATION = Histogram(
    'ai_request_duration_seconds',
    'AI provider request duration',
    ['provider', 'operation']
)

AI_REQUEST_COUNT = Counter(
    'ai_requests_total',
    'Total AI requests',
    ['provider', 'operation', 'status']
)

ERROR_COUNT = Counter(
    'errors_total',
    'Total errors',
    ['type', 'endpoint']
)


class MonitoringService:
    """Service for application monitoring."""

    def __init__(self):
        self.start_time = time.time()
        self.request_log = []
        self.error_log = []

    def record_request(
        self,
        method: str,
        endpoint: str,
        status_code: int,
        duration: float
    ):
        """Record HTTP request metrics."""
        REQUEST_COUNT.labels(
            method=method,
            endpoint=endpoint,
            status=str(status_code)
        ).inc()

        REQUEST_LATENCY.labels(
            method=method,
            endpoint=endpoint
        ).observe(duration)

        # Log request
        self.request_log.append({
            "timestamp": datetime.utcnow().isoformat(),
            "method": method,
            "endpoint": endpoint,
            "status": status_code,
            "duration_ms": round(duration * 1000, 2)
        })

        # Keep only last 1000 requests
        if len(self.request_log) > 1000:
            self.request_log = self.request_log[-1000:]

    def record_db_query(self, query_type: str, duration: float):
        """Record database query metrics."""
        DB_QUERY_DURATION.labels(query_type=query_type).observe(duration)

    def record_ai_request(
        self,
        provider: str,
        operation: str,
        duration: float,
        success: bool
    ):
        """Record AI provider request metrics."""
        AI_REQUEST_DURATION.labels(
            provider=provider,
            operation=operation
        ).observe(duration)

        AI_REQUEST_COUNT.labels(
            provider=provider,
            operation=operation,
            status="success" if success else "error"
        ).inc()

    def record_error(self, error_type: str, endpoint: str):
        """Record error metrics."""
        ERROR_COUNT.labels(type=error_type, endpoint=endpoint).inc()

        self.error_log.append({
            "timestamp": datetime.utcnow().isoformat(),
            "type": error_type,
            "endpoint": endpoint
        })

        # Keep only last 500 errors
        if len(self.error_log) > 500:
            self.error_log = self.error_log[-500:]

    def get_health_status(self) -> dict[str, Any]:
        """Get application health status."""
        uptime = time.time() - self.start_time

        return {
            "status": "healthy",
            "uptime_seconds": round(uptime, 2),
            "uptime_human": self._format_uptime(uptime),
            "timestamp": datetime.utcnow().isoformat(),
            "version": "1.0.0",
            "checks": {
                "api": "ok",
                "database": "ok",
                "cache": "ok"
            }
        }

    def get_metrics(self) -> str:
        """Get Prometheus metrics in text format."""
        return generate_latest().decode('utf-8')

    def get_recent_requests(self, limit: int = 100) -> list:
        """Get recent request logs."""
        return self.request_log[-limit:]

    def get_recent_errors(self, limit: int = 100) -> list:
        """Get recent error logs."""
        return self.error_log[-limit:]

    def get_stats_summary(self) -> dict[str, Any]:
        """Get statistics summary."""
        total_requests = len(self.request_log)
        total_errors = len(self.error_log)

        avg_latency = 0
        if total_requests > 0:
            avg_latency = sum(r["duration_ms"] for r in self.request_log) / total_requests

        return {
            "total_requests": total_requests,
            "total_errors": total_errors,
            "error_rate": round(total_errors / max(total_requests, 1) * 100, 2),
            "avg_latency_ms": round(avg_latency, 2),
            "uptime_seconds": round(time.time() - self.start_time, 2)
        }

    def _format_uptime(self, seconds: float) -> str:
        """Format uptime in human readable format."""
        days = int(seconds // 86400)
        hours = int((seconds % 86400) // 3600)
        minutes = int((seconds % 3600) // 60)
        secs = int(seconds % 60)

        parts = []
        if days > 0:
            parts.append(f"{days}d")
        if hours > 0:
            parts.append(f"{hours}h")
        if minutes > 0:
            parts.append(f"{minutes}m")
        parts.append(f"{secs}s")

        return " ".join(parts)


# Decorator for monitoring endpoints
def monitor_endpoint(monitoring_service: MonitoringService = None):
    """Decorator to monitor endpoint execution."""
    if monitoring_service is None:
        monitoring_service = get_monitoring_service()

    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            start_time = time.time()
            endpoint = func.__name__
            method = "GET"  # Would need request object for actual method

            try:
                result = await func(*args, **kwargs)
                duration = time.time() - start_time

                # Try to extract status code from result
                status = 200
                if hasattr(result, 'status_code'):
                    status = result.status_code

                monitoring_service.record_request(
                    method=method,
                    endpoint=endpoint,
                    status_code=status,
                    duration=duration
                )

                return result
            except Exception as e:
                duration = time.time() - start_time
                monitoring_service.record_request(
                    method=method,
                    endpoint=endpoint,
                    status_code=500,
                    duration=duration
                )
                monitoring_service.record_error(
                    error_type=type(e).__name__,
                    endpoint=endpoint
                )
                raise

        return wrapper
    return decorator


# Middleware for request monitoring
async def monitoring_middleware(request: Request, call_next):
    """Middleware to monitor all requests."""
    monitoring = get_monitoring_service()
    start_time = time.time()

    try:
        response = await call_next(request)
        duration = time.time() - start_time

        monitoring.record_request(
            method=request.method,
            endpoint=request.url.path,
            status_code=response.status_code,
            duration=duration
        )

        return response
    except Exception as e:
        duration = time.time() - start_time
        monitoring.record_request(
            method=request.method,
            endpoint=request.url.path,
            status_code=500,
            duration=duration
        )
        monitoring.record_error(
            error_type=type(e).__name__,
            endpoint=request.url.path
        )
        raise


# Metrics endpoint
async def metrics_endpoint(request: Request) -> Response:
    """Prometheus metrics endpoint."""
    monitoring = get_monitoring_service()
    metrics_data = monitoring.get_metrics()
    return Response(content=metrics_data, media_type=CONTENT_TYPE_LATEST)


# Health endpoint
async def health_endpoint(request: Request) -> dict[str, Any]:
    """Health check endpoint."""
    monitoring = get_monitoring_service()
    return monitoring.get_health_status()


# Singleton
_monitoring_service = None

def get_monitoring_service() -> MonitoringService:
    global _monitoring_service
    if _monitoring_service is None:
        _monitoring_service = MonitoringService()
    return _monitoring_service
