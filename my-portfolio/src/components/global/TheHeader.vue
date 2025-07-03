<template>
  <header class="site-header">
    <div class="header-content-wrapper">
      <div class="logo">
        <!-- SVG Icon for the pin/acorn symbol -->
        <svg class="logo-symbol" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
        <span class="logo-text">Joshua Mercy</span>
      </div>
      <nav class="site-nav">
        <!-- This button now calls our function when clicked -->
        <button @click="onNavTriggerClick" class="nav-trigger">Index</button>
      </nav>
    </div>
  </header>
</template>

<script setup>
// 'defineEmits' is a compiler macro used to declare the events that a component can emit.
// We are declaring that this component can send a 'toggle-nav' event.
const emit = defineEmits(['toggle-nav']);

// This function is called by the @click directive on the button.
const onNavTriggerClick = () => {
  // When the function is called, it uses the 'emit' function to send the
  // 'toggle-nav' event up to its parent component (App.vue).
  emit('toggle-nav');
};
</script>

<style scoped>
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 50;
  background-color: var(--color-background);
  padding: 0 4rem;
  box-sizing: border-box;
  border-bottom: 1px solid #e0e0e0;
}

.header-content-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  height: 100px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--color-text);
  text-decoration: none;
}

.logo-symbol {
  width: 24px;
  height: 24px;
  fill: var(--color-primary);
}

.logo-text {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 1.1rem;
}

.nav-trigger {
  font-family: var(--font-display);
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text);
  transition: color 0.3s ease;
  padding: 1rem;
}

.nav-trigger:hover {
  color: var(--color-primary);
}
</style>