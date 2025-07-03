<template>
  <div class="admin-layout">
    <header class="admin-header">
      <div class="header-content">
        <div class="logo">
          <!-- This link takes you back to the public homepage -->
          <router-link to="/">
            <svg class="logo-symbol" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span>Return to Main Site</span>
          </router-link>
        </div>
        <!-- You can add user profile info here in the future -->
      </div>
    </header>
    
    <main class="admin-main-content">
      <!-- 
        This is the crucial part. The child route (our AdminPage.vue) 
        will be rendered here, inside this layout.
      -->
      <router-view />
    </main>
  </div>
</template>

<script setup>
// This component is purely for layout, so no complex script is needed.
</script>

<style scoped>
.admin-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--color-background); /* Uses the same base background */
  color: var(--color-text);
}

.admin-header {
  width: 100%;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  z-index: 10;
  position: sticky;
  top: 0;
}

.header-content {
  /* This container does not have the same max-width as the public site, allowing for a wider dashboard */
  width: 100%;
  padding: 0 2rem;
  box-sizing: border-box;
  height: 70px;
  display: flex;
  align-items: center;
}

.logo a {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  font-family: var(--font-body);
  font-weight: 600;
  color: var(--color-text);
  transition: color 0.3s ease;
}

.logo a:hover {
  color: var(--color-primary);
}

.logo-symbol {
  width: 20px;
  height: 20px;
  fill: var(--color-primary);
}

.admin-main-content {
  flex-grow: 1; /* Ensures the main content area fills the remaining space */
  width: 100%;
}
</style>