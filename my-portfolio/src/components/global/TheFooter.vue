<template>
  <footer class="site-footer">
    <div class="container">
      <div class="social-links">
        <a href="#" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="#" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="#" target="_blank" rel="noopener noreferrer">Twitter</a>
      </div>
      <div class="footer-bottom">
        <span class="logo-text">Your Name</span>
        <span>© {{ new Date().getFullYear() }}</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  width: 100%;
  background-color: #1c1817; /* An even deeper, near-black for finality */
  color: var(--color-muted);
  padding: 3rem 0;
  box-sizing: border-box;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.social-links {
  display: flex;
  gap: 2rem;
}

.social-links a {
  font-family: var(--font-body);
  font-weight: 600;
  text-decoration: none;
  color: var(--color-muted);
  transition: color 0.3s ease;
}

.social-links a:hover {
  color: var(--color-background);
  opacity: 1;
}

.footer-bottom {
  font-size: 0.9rem;
  display: flex;
  gap: 1rem;
}

.logo-text {
  font-family: var(--font-display);
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-background);
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
    gap: 2rem;
  }
}
</style>