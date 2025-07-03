<template>
  <div class="nav-overlay" :class="{ 'is-active': isActive }" @click.self="handleClickOutside">
    <div class="nav-content">
      <div class="nav-links">
        <!-- Each link now has a specific click handler -->
        <a href="#home" class="nav-link" @click="handleLinkClick">Home</a>
        <a href="#projects" class="nav-link" @click="handleLinkClick">Projects</a>
        <a href="/services" class="nav-link" @click="handleLinkClick">Services</a> <!-- New Link -->
        <a href="/about" class="nav-link" @click="handleLinkClick">About</a>
        <a href="/contact" class="nav-link" @click="handleLinkClick">Contact</a>
      </div>
      <div class="nav-meta">
        <p class="meta-quote">"One finds aesthetic beauty only after seeking structured efficiency."</p>
        <div class="meta-contact">
          <a href="mailto:mercyjoshu0@gmail.com">mercyjoshu0@gmail.com</a>
          <div class="meta-socials">
            <a href="https://github.com/Joshuawayne">GH</a> <a href="https://linkedin.com/in/joshuamercy">LN</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { nextTick } from 'vue';

defineProps({
  isActive: Boolean,
});
const emit = defineEmits(['close-nav']);
const router = useRouter();

const handleLinkClick = (event) => {
  event.preventDefault();
  const path = event.target.getAttribute('href');

  // First, always close the navigation menu
  emit('close-nav');

  // Use nextTick to allow the closing animation to start
  nextTick(() => {
    // Check if the link is an internal hash link for the homepage
    if (path.startsWith('#')) {
      // If so, navigate to the homepage with the hash
      router.push(`/${path}`);
    } else {
      // Otherwise, it's a link to a different page (like /services)
      router.push(path);
    }
  });
};

const handleClickOutside = () => {
  emit('close-nav');
};
</script>

<style scoped>
/* All styles remain the same. The changes are only in the template and script. */
.nav-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--color-background);
  z-index: 45;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-20px);
  transition: opacity 0.5s ease, visibility 0s 0.5s, transform 0.5s ease;
}
.nav-overlay.is-active {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
  transition: opacity 0.5s ease, visibility 0s 0s, transform 0.5s ease;
}
.nav-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 6rem;
  width: 100%;
  max-width: 1200px;
  padding: 0 4rem;
  box-sizing: border-box;
}
.nav-links {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.nav-link {
  font-family: var(--font-display);
  font-size: clamp(3rem, 7vw, 5rem); /* Adjusted size for more links */
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1.2; /* Adjusted line height */
  color: var(--color-text);
  text-decoration: none;
  transition: color 0.4s ease;
}
.nav-link:hover {
  color: var(--color-primary);
}
.nav-meta {
  padding-top: 1rem;
  border-left: 1px solid #e0e0e0;
  padding-left: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.meta-quote {
  font-family: var(--font-body);
  font-size: 1.1rem;
  font-style: italic;
  line-height: 1.6;
  max-width: 20em;
  color: var(--color-text);
  opacity: 0.8;
}
.meta-contact {
  font-family: var(--font-body);
  font-weight: 600;
}
.meta-contact a {
  text-decoration: none;
}
.meta-socials {
  margin-top: 1rem;
  display: flex;
  gap: 1.5rem;
}
</style>