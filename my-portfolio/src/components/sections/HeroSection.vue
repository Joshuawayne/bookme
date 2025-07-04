<template>
  <section class="hero-section" id="home">
    <div class="container">
      <!-- This new grid creates our two-column layout -->
      <div class="hero-grid">
        
        <!-- Column 1: The Interactive Animation -->
        <div class="animation-column">
          <ClothAnimation />
        </div>

        <!-- Column 2: The Text Content -->
        <div class="text-column">
          <h1 class="hero-title">
            Devotion to the craft of building beautiful and efficient digital experiences.
          </h1>
          <p class="hero-intro">
            Drawing from the principles of structured efficiency and classical harmony, I approach web development as an act of architecture—creating solutions that are not only functional, but enduring.
          </p>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
// Import our new, self-contained animation component
import ClothAnimation from '@/components/ui/ClothAnimation.vue';
</script>

<style scoped>
.hero-section {
  /* We maintain the top padding to create space for the fixed header */
  padding-top: 140px; 
  padding-bottom: 8rem;
  min-height: 100vh;
  box-sizing: border-box;
  
  /* We use flexbox here to vertically center the grid within the section */
  display: flex;
  align-items: center;

  background-color: var(--color-background);
  overflow: hidden; /* Prevents any animation artifacts from spilling out */
}

/* This container is a global class, ensuring alignment with the rest of the site */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 4rem;
  width: 100%;
}

/* This is the core of the new layout */
.hero-grid {
  display: grid;
  grid-template-columns: 1fr 1.5fr; /* Asymmetrical columns (animation on left, text on right) */
  gap: 4rem; /* Space between the animation and the text */
  align-items: center; /* Vertically align the content of both columns */
}

.animation-column {
  /* This ensures the animation is centered if it's smaller than the column */
  display: flex;
  justify-content: center;
}

/* The text is now left-aligned for a more editorial feel */
.text-column {
  text-align: left;
}

.hero-title {
  font-size: clamp(2.5rem, 4vw, 3.2rem); /* Slightly adjusted for the new layout */
  font-weight: 400;
  line-height: 1.3;
  letter-spacing: 0.05em;
  margin: 0;
}

.hero-intro {
  font-size: 1.25rem;
  line-height: 1.8;
  max-width: 35em; /* A bit narrower for the column layout */
  margin: 2.5rem 0 0 0; /* Align to the left, no auto margin */
  opacity: 0.8;
}

/* Responsive adjustments for tablets and mobile */
@media (max-width: 900px) {
  .hero-grid {
    grid-template-columns: 1fr; /* Stack the columns */
    text-align: center; /* Center everything on smaller screens */
  }
  
  .text-column {
    text-align: center;
    margin-top: 2rem; /* Add space between animation and text when stacked */
  }
  
  .hero-intro {
    margin: 2.5rem auto 0 auto; /* Re-center the paragraph */
  }
}
</style>
