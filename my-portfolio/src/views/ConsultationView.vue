<template>
  <div class="consultation-page">
    <!-- 
      This is the new container div. It uses the global .container class 
      from main.css to handle max-width, margin, and padding, ensuring
      its content aligns perfectly with the header and other sections.
    -->
    <div class="container">
      <header class="page-header">
        <h1 class="page-title">Book a Consultation</h1>
        <p class="page-subtitle">
          This complimentary 30-minute call is the foundational step in our collaboration.
        </p>
      </header>
      
      <div class="page-content">
        <!-- Left Column: Context and Reassurance -->
        <aside class="sidebar">
          <div class="agenda">
            <h3 class="agenda-title">Agenda for our Call</h3>
            <ul>
              <li>
                <strong>Your Vision:</strong> We'll discuss your project's goals, target audience, and desired outcomes.
              </li>
              <li>
                <strong>Technical Scope:</strong> We'll outline the key features and architectural requirements.
              </li>
              <li>
                <strong>Next Steps:</strong> We'll determine if we are a good fit and define the path to a formal proposal.
              </li>
            </ul>
          </div>
          <p class="sidebar-footer">
            I look forward to learning about your project.
          </p>
        </aside>

        <!-- Right Column: The Action -->
        <div class="widget-main">
          <div class="calendly-widget-container">
            <div 
              class="calendly-inline-widget" 
              data-url="https://calendly.com/mercyjoshu0/30min" 
              style="min-width: 320px; height: 700px;"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCalendly } from '@/composables/useCalendly.js';
// This composable handles loading the Calendly script needed for the widget.
useCalendly();
</script>

<style scoped>
.consultation-page {
  /* Provides top and bottom spacing for the entire page section */
  padding: 6rem 0; /* Adjusted padding */
}

/* The .container class is now handled globally in main.css */
/* This ensures the content within this page is perfectly aligned. */

.page-header {
  text-align: center;
  padding-bottom: 4rem;
  margin-bottom: 4rem;
  border-bottom: 1px solid #e0e0e0;
}
.page-title {
  font-size: 3.5rem;
  margin-top: 0;
}
.page-subtitle {
  font-size: 1.2rem;
  max-width: 40em;
  margin: 1.5rem auto 0 auto;
  opacity: 0.8;
  line-height: 1.7;
}

.page-content {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 5rem;
  align-items: flex-start;
}

/* Sidebar (Left Column) */
.sidebar {
  position: sticky;
  top: 140px; /* Stick below the header */
}

.agenda {
  /* No changes needed */
}

.agenda-title {
  font-family: var(--font-body);
  font-size: 1.1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-muted);
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
}

.agenda ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.agenda li {
  font-size: 1rem;
  line-height: 1.6;
}

.sidebar-footer {
  margin-top: 3rem;
  font-style: italic;
  color: var(--color-muted);
}

/* Widget (Right Column) */
.widget-main {
  /* This column scrolls */
}

.calendly-widget-container {
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  min-height: 700px;
  background-color: #f9f9f9; /* Placeholder color */
}

/* Responsive adjustments */
@media (max-width: 900px) {
  .page-content {
    grid-template-columns: 1fr;
  }
  .sidebar {
    position: static;
    text-align: center;
    margin-bottom: 4rem;
  }
  .agenda {
    text-align: left;
  }
}
</style>