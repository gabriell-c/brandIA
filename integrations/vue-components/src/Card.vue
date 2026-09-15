<template>
  <div :class="['omni-card', paddingClass, className]">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}>();

const paddingClass = computed(() => {
  return `omni-card--${padding || 'md'}`;
});
</script>

<style scoped>
.omni-card {
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  border: 1px solid var(--color-border, #E5E7EB);
}

.omni-card--none { padding: 0; }
.omni-card--sm { padding: 0.75rem; }
.omni-card--md { padding: 1.5rem; }
.omni-card--lg { padding: 2rem; }
</style>