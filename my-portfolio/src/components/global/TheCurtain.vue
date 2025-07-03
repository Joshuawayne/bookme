<template>
  <div class="curtain-overlay" ref="curtain">
    <div class="curtain-content">
      <h1 class="curtain-title">A Developer's Portfolio</h1>
      <p class="curtain-subtitle">Joshua Mercy Odhiambo</p> 
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { gsap } from 'gsap';

const curtain = ref(null);

onMounted(() => {
  document.body.style.overflow = 'hidden';
  const reveal = () => {
    gsap.to(curtain.value, {
      y: '-100%',
      duration: 1.5,
      ease: 'power3.inOut',
      onComplete: () => {
        document.body.style.overflow = 'auto'; // Re-enables native browser scroll
      }
    });
  };
  setTimeout(reveal, 2000);
});
</script>

<style scoped>
.curtain-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 40;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  /* --- THE NEW BACKGROUND PATTERN --- */
  /* This uses our --color-background (Parchment) as the base */
  background-color: var(--color-background);
  
  /* This creates the pattern using multiple CSS gradients. */
  /* The dots are a semi-transparent version of our --color-muted (Stone Gray) */
  background-image: 
    radial-gradient(circle at center, rgba(158, 152, 141, 0.3) 1px, transparent 1px);
  
  /* This sets the size of each "cell" in our grid pattern */
  background-size: 20px 20px;
}

.curtain-title {
  font-family: var(--font-display);
  font-size: clamp(2rem, 8vw, 5rem);
  font-weight: 400;
  color: var(--color-text);
  line-height: 1.1;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.curtain-subtitle {
  font-family: var(--font-body);
  font-size: 1.2rem;
  color: var(--color-muted);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-top: 1rem;
}
</style>