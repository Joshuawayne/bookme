<template>
  <div class="services-page">
    <header class="page-header">
      <h1 class="page-title">Services & Engagements</h1>
      <p class="page-subtitle">A transparent overview of my offerings, designed to provide clarity and establish a foundation for our potential collaboration.</p>
    </header>

    <!-- Packages Section -->
    <section class="packages-section">
      <h2 class="section-title">Service Packages</h2>
      <div class="packages-grid">
        <!-- Card 1: Website -->
        <div class="package-card">
          <h3>Essential Website</h3>
          <p class="price">Starting at <strong>30,000 KES</strong></p>
          <ul>
            <li>Up to 5 Pages</li>
            <li>Responsive Design</li>
            <li>Basic SEO Setup</li>
            <li>Contact Form</li>
          </ul>
          <button class="select-button">Select & Configure</button>
        </div>
        <!-- Card 2: E-commerce -->
        <div class="package-card">
          <h3>E-Commerce Platform</h3>
          <p class="price">Starting at <strong>50,000 KES</strong></p>
          <ul>
            <li>Full Store Setup</li>
            <li>Payment Gateway Integration</li>
            <li>Product Management System</li>
            <li>Secure Checkout</li>
          </ul>
          <button class="select-button">Select & Configure</button>
        </div>
        <!-- Card 3: IT Support -->
        <div class="package-card">
          <h3>IT Support Retainer</h3>
          <p class="price">From <strong>15,000 KES</strong> / mo</p>
          <ul>
            <li>System Monitoring</li>
            <li>On-call Technical Support</li>
            <li>Security Audits</li>
            <li>Software Updates</li>
          </ul>
          <button class="select-button">Select & Configure</button>
        </div>
      </div>
    </section>

    <!-- Budget Calculator & Currency Converter Section -->
    <section class="calculator-section">
      <div class="calculator-wrapper">
        <h2 class="section-title">Custom Project Calculator</h2>
        <p class="section-intro">Use this tool to build a custom quote for projects that require a more bespoke architectural approach.</p>
        
        <!-- The Budget Calculator component is now integrated -->
        <BudgetCalculator />
      </div>
      
      <aside class="converter-wrapper">
        <h3 class="converter-title">Currency Converter</h3>
        
        <!-- The Currency Converter component is integrated -->
        <CurrencyConverter />
        
        <p class="disclaimer">Estimates are based on real-time exchange rates. The final proposal will be billed in KES.</p>
      </aside>
    </section>
  </div>
</template>

<script setup>
// Import our interactive UI widgets
import CurrencyConverter from '@/components/ui/CurrencyConverter.vue';
import BudgetCalculator from '@/components/ui/BudgetCalculator.vue';
</script>

<style scoped>
/* General Page Layout */
.services-page {
  padding-bottom: 8rem;
}
.page-header {
  text-align: center;
  padding: 4rem 0 6rem 0;
}
.page-title {
  font-size: 3.5rem;
}
.page-subtitle {
  font-size: 1.2rem;
  max-width: 35em;
  margin: 1rem auto 0 auto;
  opacity: 0.8;
}
.section-title {
  text-align: center;
  margin-bottom: 3rem;
}

/* Packages Section */
.packages-section {
  padding-bottom: 6rem;
  border-bottom: 1px solid #e0e0e0;
}
.packages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}
.package-card {
  border: 1px solid #e0e0e0;
  padding: 2rem;
  display: flex;
  flex-direction: column;
}
.package-card h3 {
  font-size: 1.5rem;
  margin-top: 0;
  margin-bottom: 1rem;
}
.price {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}
.price strong {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 400;
  color: var(--color-primary);
}
.package-card ul {
  list-style-type: '✓  ';
  padding-left: 1.5rem;
  flex-grow: 1;
  margin-bottom: 2rem;
}
.select-button {
  background-color: var(--color-text);
  color: var(--color-background);
  font-family: var(--font-display);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border: none;
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.select-button:hover {
  background-color: var(--color-primary);
}

/* Calculator & Converter Section */
.calculator-section {
  padding-top: 6rem;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 4rem;
  align-items: flex-start;
}
.section-intro {
  text-align: center;
  margin: -2rem auto 3rem auto;
  max-width: 40em;
  opacity: 0.8;
}
.converter-wrapper {
  position: sticky;
  top: 140px;
}
.converter-title {
  font-size: 1.5rem;
  margin-top: 0;
  text-align: center;
  margin-bottom: 1.5rem;
}
.disclaimer {
  font-size: 0.8rem;
  text-align: center;
  color: var(--color-muted);
  margin-top: 1rem;
  font-style: italic;
}

/* Responsive adjustments */
@media (max-width: 900px) {
  .calculator-section {
    grid-template-columns: 1fr;
  }
  .converter-wrapper {
    position: static;
    margin-top: 4rem;
  }
}
</style>
