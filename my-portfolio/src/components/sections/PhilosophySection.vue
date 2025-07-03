<template>
  <section class="philosophy-section" id="about">
    <div class="container">
      <div class="section-content">
        <div class="title-column">
          <h2 class="section-title">
            <span class="title-super">Our Guiding Principle</span>
            Philosophy
          </h2>
        </div>
        <div class="text-column">
          <p class="philosophy-text">
            My process is guided by a core belief: true beauty and innovation emerge from a foundation of structured efficiency. Like the masters of the neoclassical era, I see technology not as an end, but as a medium for creating digital experiences that are harmonious, enduring, and meticulously crafted.
          </p>
          <p>
            Each project is an exercise in returning to the origin—understanding the fundamental problem to build a solution that is both elegant and effective.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.philosophy-section {
  width: 100%;
  background-color: var(--color-background);
  padding: 10rem 0; /* Increased padding for more gravitas */
  box-sizing: border-box;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 4rem;
}

.section-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 5rem;
  align-items: start; /* Align items to the top */
}

.title-column {
  position: sticky;
  top: 140px; /* Align with header space */
}

.section-title {
  margin: 0;
  text-align: left;
}

.title-super {
  display: block;
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 400;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-bottom: 0.5rem;
}

.philosophy-text {
  font-size: 1.5rem;
  line-height: 1.7;
}

@media (max-width: 768px) {
  .section-content { grid-template-columns: 1fr; }
  .title-column { position: static; margin-bottom: 2rem; }
}
</style>