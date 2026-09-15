<template>
  <button
    :class="['omni-button', `omni-button--${variant}`, `omni-button--${size}`, className]"
    :disabled="disabled"
    :type="type"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}>();
</script>

<style scoped>
.omni-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  font-family: var(--font-body, system-ui, sans-serif);
}

.omni-button--primary {
  background-color: var(--color-primary, #3B82F6);
  color: white;
}

.omni-button--primary:hover {
  background-color: var(--color-primary-dark, #2563EB);
}

.omni-button--secondary {
  background-color: var(--color-secondary, #10B981);
  color: white;
}

.omni-button--secondary:hover {
  background-color: var(--color-secondary-dark, #059669);
}

.omni-button--outline {
  background-color: transparent;
  border: 1px solid var(--color-primary, #3B82F6);
  color: var(--color-primary, #3B82F6);
}

.omni-button--outline:hover {
  background-color: var(--color-primary, #3B82F6);
  color: white;
}

.omni-button--ghost {
  background-color: transparent;
  color: var(--color-primary, #3B82F6);
}

.omni-button--ghost:hover {
  background-color: var(--color-primary-light, #DBEAFE);
}

.omni-button--sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
}

.omni-button--md {
  padding: 0.5rem 1rem;
  font-size: 1rem;
}

.omni-button--lg {
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
}

.omni-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>