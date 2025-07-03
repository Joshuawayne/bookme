<template>
  <section class="contact-section" id="contact">
    <div class="container">
      <h2 class="section-title">
        <span class="title-super">Let's Build Together</span>
        Services & Inquiries
      </h2>
      <p class="section-intro">
        I offer dedicated development services to bring structure and beauty to your digital projects. 
        Select an engagement model below, or contact me directly for collaborations.
      </p>

      <div class="services-grid">
        <!-- Service 1: Custom Development -->
        <div class="service-card">
          <h3 class="service-title">Custom Software & Web Applications</h3>
          <p class="service-description">For complex, bespoke projects that require a deep architectural and strategic approach. Ideal for unique business challenges and scalable platforms.</p>
          <router-link to="/consultation" class="service-button">Book a Consultation</router-link>
        </div>

        <!-- Service 2: Packaged Services -->
        <div class="service-card">
          <h3 class="service-title">Websites & IT Support</h3>
          <p class="service-description">For well-defined projects with clear scope. View my transparent pricing for website packages and monthly IT support retainers.</p>
          <router-link to="/services" class="service-button">View Packages & Rates</router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// This component is purely presentational and relies on <router-link> for navigation.
// Therefore, no specific script logic is needed.
</script>

<style scoped>
/* All styles are correct as you provided them. */
.contact-section {
  width: 100%;
  background-color: var(--color-text);
  color: var(--color-background);
  padding: 8rem 0;
  box-sizing: border-box;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 4rem;
  text-align: center;
}
.section-title {
  color: var(--color-background);
}
.title-super {
  display: block;
  font-family: var(--font-body);
  font-weight: 400;
  font-size: 1rem;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-bottom: 0.5rem;
}
.section-intro {
  font-size: 1.2rem;
  max-width: 40em;
  margin: 0 auto 4rem auto;
  opacity: 0.7;
}
.services-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  text-align: left;
}
.service-card {
  border: 1px solid rgba(248, 244, 233, 0.2);
  background-color: rgba(248, 244, 233, 0.05);
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  transition: background-color 0.3s ease;
}
.service-card:hover {
  background-color: rgba(248, 244, 233, 0.1);
}
.service-title {
  font-size: 1.5rem;
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--color-background);
}
.service-description {
  margin-bottom: 2rem;
  opacity: 0.7;
  flex-grow: 1;
}
.service-button {
  display: inline-block;
  align-self: flex-start;
  background-color: var(--color-primary);
  color: #fff !important;
  font-family: var(--font-display);
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-decoration: none;
  padding: 1rem 1.5rem;
  transition: background-color 0.3s ease, transform 0.3s ease;
  opacity: 1 !important;
}
.service-button:hover {
  background-color: #A33A24;
  transform: translateY(-3px);
}
@media (max-width: 768px) {
  .services-grid {
    grid-template-columns: 1fr;
  }
}
</style>
