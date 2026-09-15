"""
WCAG Accessibility Validator
"""
from dataclasses import dataclass
from enum import Enum
from typing import Any


class ContrastLevel(Enum):
    """WCAG 2.1 contrast levels."""
    PASS_AA = "pass_aa"
    PASS_AAA = "pass_aaa"
    FAIL = "fail"


class ColorBlindnessType(Enum):
    """Types of color blindness."""
    PROTANOA = "protanopia"  # Red-blind
    DEUTERANO = "deuteranopia"  # Green-blind
    TRITANO = "tritanopia"  # Blue-blind
    ACHROMATOPSIA = "achromatopsia"  # Complete color blindness


@dataclass
class ContrastResult:
    """Result of a contrast check."""
    color1: str
    color2: str
    ratio: float
    level: ContrastLevel
    pass_aa: bool
    pass_aaa: bool
    explanation: str


@dataclass
class ColorBlindnessSimulation:
    """Simulation of color blindness."""
    original_color: str
    simulated_color: str
    blindness_type: ColorBlindnessType
    legible: bool
    explanation: str


class WCAGValidator:
    """WCAG 2.1 accessibility validator."""

    # WCAG 2.1 contrast requirements
    AA_NORMAL_TEXT = 4.5  # Normal text (< 18pt or not bold)
    AA_LARGE_TEXT = 3.0   # Large text (>= 18pt or >= 14pt bold)
    AAA_NORMAL_TEXT = 7.0
    AAA_LARGE_TEXT = 4.5

    # Color blindness simulation matrices
    COLOR_BLINDNESS_MATRICES = {
        ColorBlindnessType.PROTANOA: [
            [0.567, 0.433, 0.000],
            [0.558, 0.442, 0.000],
            [0.000, 0.242, 0.758]
        ],
        ColorBlindnessType.DEUTERANO: [
            [0.625, 0.375, 0.000],
            [0.700, 0.300, 0.000],
            [0.000, 0.300, 0.700]
        ],
        ColorBlindnessType.TRITANO: [
            [0.950, 0.050, 0.000],
            [0.000, 0.433, 0.567],
            [0.000, 0.475, 0.525]
        ],
        ColorBlindnessType.ACHROMATOPSIA: [
            [0.299, 0.587, 0.114],
            [0.299, 0.587, 0.114],
            [0.299, 0.587, 0.114]
        ]
    }

    def hex_to_rgb(self, hex_color: str) -> tuple:
        """Convert hex color to RGB tuple."""
        hex_color = hex_color.lstrip('#')
        if len(hex_color) != 6:
            raise ValueError(f"Invalid hex color: {hex_color}")
        return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

    def rgb_to_hex(self, r: int, g: int, b: int) -> str:
        """Convert RGB to hex color."""
        return f"#{r:02X}{g:02X}{b:02X}"

    def relative_luminance(self, r: int, g: int, b: int) -> float:
        """Calculate relative luminance (WCAG 2.1)."""
        # Convert sRGB to linear RGB
        rsRGB = r / 255
        gsRGB = g / 255
        bsRGB = b / 255

        r = rsRGB / 12.92 if rsRGB <= 0.03928 else ((rsRGB + 0.055) / 1.055) ** 2.4
        g = gsRGB / 12.92 if gsRGB <= 0.03928 else ((gsRGB + 0.055) / 1.055) ** 2.4
        b = bsRGB / 12.92 if bsRGB <= 0.03928 else ((bsRGB + 0.055) / 1.055) ** 2.4

        return 0.2126 * r + 0.7152 * g + 0.0722 * b

    def contrast_ratio(self, color1: str, color2: str) -> float:
        """Calculate contrast ratio between two colors."""
        r1, g1, b1 = self.hex_to_rgb(color1)
        r2, g2, b2 = self.hex_to_rgb(color2)

        l1 = self.relative_luminance(r1, g1, b1)
        l2 = self.relative_luminance(r2, g2, b2)

        lighter = max(l1, l2)
        darker = min(l1, l2)

        return (lighter + 0.05) / (darker + 0.05)

    def check_contrast(self, color1: str, color2: str, text_size: str = "normal") -> ContrastResult:
        """Check contrast between two colors."""
        ratio = self.contrast_ratio(color1, color2)

        # Determine requirements based on text size
        if text_size == "large":
            aa_required = self.AA_LARGE_TEXT
            aaa_required = self.AAA_LARGE_TEXT
        else:
            aa_required = self.AA_NORMAL_TEXT
            aaa_required = self.AAA_NORMAL_TEXT

        # Determine level
        if ratio >= aaa_required:
            level = ContrastLevel.PASS_AAA
        elif ratio >= aa_required:
            level = ContrastLevel.PASS_AA
        else:
            level = ContrastLevel.FAIL

        # Generate explanation
        if level == ContrastLevel.PASS_AAA:
            explanation = f"Excellent contrast ratio of {ratio:.2f}:1. Passes AAA level for both normal and large text."
        elif level == ContrastLevel.PASS_AA:
            explanation = f"Good contrast ratio of {ratio:.2f}:1. Passes AA level. Consider improving for AAA if possible."
        else:
            explanation = f"Poor contrast ratio of {ratio:.2f}:1. Does not meet AA requirements. Increase contrast between colors."

        return ContrastResult(
            color1=color1,
            color2=color2,
            ratio=round(ratio, 2),
            level=level,
            pass_aa=level in [ContrastLevel.PASS_AA, ContrastLevel.PASS_AAA],
            pass_aaa=level == ContrastLevel.PASS_AAA,
            explanation=explanation
        )

    def simulate_color_blindness(self, color: str, blindness_type: ColorBlindnessType) -> ColorBlindnessSimulation:
        """Simulate how a color appears to someone with color blindness."""
        r, g, b = self.hex_to_rgb(color)

        # Apply matrix
        matrix = self.COLOR_BLINDNESS_MATRICES[blindness_type]
        new_r = int(r * matrix[0][0] + g * matrix[0][1] + b * matrix[0][2])
        new_g = int(r * matrix[1][0] + g * matrix[1][1] + b * matrix[1][2])
        new_b = int(r * matrix[2][0] + g * matrix[2][1] + b * matrix[2][2])

        # Clamp values
        new_r = max(0, min(255, new_r))
        new_g = max(0, min(255, new_g))
        new_b = max(0, min(255, new_b))

        simulated = self.rgb_to_hex(new_r, new_g, new_b)

        # Check legibility (compare luminance difference)
        orig_lum = self.relative_luminance(r, g, b)
        sim_lum = self.relative_luminance(new_r, new_g, new_b)
        luminance_diff = abs(orig_lum - sim_lum)

        legible = luminance_diff > 0.1  # Arbitrary threshold

        explanations = {
            ColorBlindnessType.PROTANOA: "Protanopia: Reduced red perception. Colors may appear less vibrant.",
            ColorBlindnessType.DEUTERANO: "Deuteranopia: Reduced green perception. Similar to protanopia but more common.",
            ColorBlindnessType.TRITANO: "Tritanopia: Reduced blue perception. Rare form of color blindness.",
            ColorBlindnessType.ACHROMATOPSIA: "Achromatopsia: Complete color blindness. See only in grayscale."
        }

        return ColorBlindnessSimulation(
            original_color=color,
            simulated_color=simulated,
            blindness_type=blindness_type,
            legible=legible,
            explanation=f"{explanations[blindness_type]} Luminance difference: {luminance_diff:.3f}"
        )

    def validate_palette(self, palette: dict[str, str], text_color: str = "#000000") -> dict[str, Any]:
        """Validate an entire palette for accessibility."""
        results = {
            "colors": palette,
            "text_color": text_color,
            "contrast_checks": [],
            "blindness_simulations": [],
            "overall_pass": True,
            "warnings": []
        }

        # Check contrast of each color against text
        for color_name, color_value in palette.items():
            contrast = self.check_contrast(color_value, text_color)
            results["contrast_checks"].append({
                "color_name": color_name,
                "color": color_value,
                "against": text_color,
                "ratio": contrast.ratio,
                "level": contrast.level.value,
                "pass_aa": contrast.pass_aa,
                "pass_aaa": contrast.pass_aaa,
                "explanation": contrast.explanation
            })
            if not contrast.pass_aa:
                results["overall_pass"] = False
                results["warnings"].append(f"Color '{color_name}' ({color_value}) fails AA contrast against text")

        # Simulate color blindness for main colors
        for blindness_type in [ColorBlindnessType.PROTANOA, ColorBlindnessType.DEUTERANO, ColorBlindnessType.TRITANO]:
            for color_name, color_value in palette.items():
                if color_name in ["primary", "secondary", "accent"]:
                    simulation = self.simulate_color_blindness(color_value, blindness_type)
                    results["blindness_simulations"].append({
                        "color_name": color_name,
                        "color": color_value,
                        "blindness_type": blindness_type.value,
                        "simulated_color": simulation.simulated_color,
                        "legible": simulation.legible,
                        "explanation": simulation.explanation
                    })

        return results


# Singleton instance
_validator = None

def get_validator() -> WCAGValidator:
    """Get or create validator instance."""
    global _validator
    if _validator is None:
        _validator = WCAGValidator()
    return _validator
