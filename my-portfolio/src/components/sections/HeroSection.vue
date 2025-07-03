<template>
  <section class="hero-section">
    <div class="hero-text-content">
      <h1 class="hero-title">
        Devotion to the craft of building beautiful and efficient digital experiences.
      </h1>
      <p class="hero-intro">
        Drawing from the principles of structured efficiency and classical harmony, I approach web development as an act of architecture—creating solutions that are not only functional, but enduring.
      </p>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  /* This is the key: it creates the space for the fixed header */
  padding-top: 140px; 
  padding-bottom: 8rem; /* Creates space below the hero text */
  min-height: 100vh;
  box-sizing: border-box; /* Ensures padding is included in height calculation */
  
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  
  /* The base parchment color */
  background-color: var(--color-background); 
}

.hero-text-content {
  max-width: 45em;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 400;
  line-height: 1.3;
  letter-spacing: 0.05em;
  margin: 0;
}

.hero-intro {
  font-size: 1.25rem;
  line-height: 1.8;
  max-width: 40em;
  margin: 2.5rem auto 0 auto;
}
</style>