<template>
  <!-- Wrap the entire widget in a form element -->
  <form class="calculator-widget" @submit.prevent="handleSubmit">
    <!-- Step 1: Project Type -->
    <div class="form-step">
      <h4>1. Project Type</h4>
      <div class="options-grid">
        <label v-for="item in projectTypes" :key="item.id" class="option-card">
          <input type="radio" :value="item.id" v-model="selectedType">
          <span>{{ item.label }}</span>
        </label>
      </div>
    </div>

    <!-- Step 2: Core Features -->
    <div class="form-step">
      <h4>2. Core Features (Select all that apply)</h4>
      <div class="options-grid checkbox-grid">
        <label v-for="item in coreFeatures" :key="item.id" class="option-card">
          <input type="checkbox" :value="item.id" v-model="selectedFeatures">
          <span>{{ item.label }}</span>
        </label>
      </div>
    </div>
    
    <!-- The Live-Updating Result -->
    <div class="result-box">
      <span class="result-label">Estimated Budget Range</span>
      <span class="result-amount">{{ budget.min }} - {{ budget.max }} KES</span>
      <p class="result-disclaimer">This is a preliminary estimate. A formal proposal will be provided after a consultation.</p>
    </div>

    <!-- Step 3: Client Email Input -->
    <div class="form-step">
      <h4>3. Your Email Address</h4>
      <p class="email-prompt">Enter your email to receive a PDF summary of this estimate and to begin the consultation process.</p>
      <input 
        type="email" 
        class="email-input"
        v-model="clientEmail"
        placeholder="your.email@example.com"
        required 
      />
    </div>

    <!-- Final Submission Button -->
    <button type="submit" class="submit-button" :disabled="isSubmitting">
      <!-- Show different text based on submission state -->
      <span v-if="isSubmitting">Generating Proposal...</span>
      <span v-else>Submit for Formal Proposal</span>
    </button>
    
    <!-- User Feedback Message Area -->
    <div v-if="submissionMessage" class="feedback-message" :class="{ 'is-error': submissionError }">
      {{ submissionMessage }}
    </div>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue';

// --- DATA STRUCTURE (remains the same) ---
const projectTypes = [
  { id: 'website', label: 'Standard Website', cost: 50000 },
  { id: 'ecommerce', label: 'E-commerce Store', cost: 150000 },
  { id: 'webapp', label: 'Custom Web App', cost: 300000 },
];
const coreFeatures = [
  { id: 'cms', label: 'CMS / Blog', cost: 40000 },
  { id: 'auth', label: 'User Accounts', cost: 60000 },
  { id: 'animation', label: 'Advanced Animations', cost: 50000 },
  { id: 'api', label: '3rd Party API Int.', cost: 45000 },
];

// --- STATE (remains the same) ---
const selectedType = ref('website');
const selectedFeatures = ref([]);

// --- NEW STATE for Form Submission ---
const clientEmail = ref('');
const isSubmitting = ref(false);
const submissionMessage = ref('');
const submissionError = ref(false);

// --- COMPUTED PROPERTY (remains the same) ---
const budget = computed(() => {
  const baseCost = projectTypes.find(p => p.id === selectedType.value)?.cost || 0;
  const featuresCost = selectedFeatures.value.reduce((total, featureId) => {
    const featureCost = coreFeatures.find(f => f.id === featureId)?.cost || 0;
    return total + featureCost;
  }, 0);
  const totalCost = baseCost + featuresCost;
  const min = totalCost * 0.85;
  const max = totalCost * 1.15;
  const format = (num) => num.toLocaleString('en-US', { maximumFractionDigits: 0 });
  return { min: format(min), max: format(max) };
});


// --- NEW SUBMISSION HANDLER ---
const handleSubmit = async () => {
  if (!clientEmail.value) {
    alert('Please enter your email address.');
    return;
  }

  // Set loading state
  isSubmitting.value = true;
  submissionMessage.value = '';
  submissionError.value = false;

  // Prepare the data payload to send to the backend
  const payload = {
    clientEmail: clientEmail.value,
    projectType: projectTypes.find(p => p.id === selectedType.value),
    features: coreFeatures.filter(f => selectedFeatures.value.includes(f.id)),
    budget: budget.value,
  };

  try {
    // Use the native fetch API to send a POST request to our Node.js server
    const response = await fetch('http://localhost:3000/api/generate-proposal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      // If the server responds with an error status (e.g., 400, 500)
      throw new Error('An error occurred on the server.');
    }

    // Handle success
    submissionMessage.value = "Success! Your proposal summary has been sent to your email.";
    submissionError.value = false;

  } catch (error) {
    // Handle network errors or server errors
    console.error('Submission failed:', error);
    submissionMessage.value = "Submission failed. Please try again or contact me directly.";
    submissionError.value = true;
  } finally {
    // Reset the submitting state regardless of outcome
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.calculator-widget {
  border: 1px solid #e0e0e0;
  padding: 2rem;
  border-radius: 4px;
}

.form-step {
  margin-bottom: 2.5rem;
}
.form-step h4 {
  font-family: var(--font-body);
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0;
  font-size: 1.2rem;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 0.75rem;
  margin-bottom: 1.5rem;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.option-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}
.option-card:has(input:checked) {
  border-color: var(--color-primary);
  background-color: #fdf5ef; /* A slightly tinted background for selection */
  box-shadow: 0 0 0 2px var(--color-primary);
}
.option-card input {
  /* Custom styled radio/checkboxes */
  appearance: none;
  background-color: #fff;
  margin: 0;
  font: inherit;
  color: currentColor;
  width: 1.15em;
  height: 1.15em;
  border: 0.15em solid currentColor;
  border-radius: 0.15em;
  transform: translateY(-0.075em);
  display: grid;
  place-content: center;
}
.option-card input::before {
  content: "";
  width: 0.65em;
  height: 0.65em;
  transform: scale(0);
  transition: 120ms transform ease-in-out;
  box-shadow: inset 1em 1em var(--color-primary);
}
.option-card input:checked::before {
  transform: scale(1);
}
.option-card input[type="radio"] {
  border-radius: 50%;
}
.option-card input[type="radio"]::before {
  border-radius: 50%;
}
.option-card span {
  font-family: var(--font-body);
  font-weight: 600;
}

.result-box {
  background-color: var(--color-stone-gray);
  padding: 2rem;
  text-align: center;
  border-radius: 4px;
  margin: 3rem 0;
}
.result-label {
  display: block;
  font-size: 1rem;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.result-amount {
  display: block;
  font-family: var(--font-display);
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1.2;
  margin-top: 0.5rem;
}
.result-disclaimer {
  font-size: 0.8rem;
  opacity: 0.7;
  margin-top: 1rem;
  margin-bottom: 0;
}

/* --- NEW STYLES START HERE --- */

.email-prompt {
  font-size: 0.9rem;
  color: var(--color-muted);
  text-align: center;
  margin-top: 3rem;
  margin-bottom: 1rem;
}

.email-input {
  width: 100%;
  padding: 1rem;
  font-family: var(--font-body);
  font-size: 1.2rem;
  border: 1px solid #e0e0e0;
  background-color: var(--color-background);
  color: var(--color-text);
  box-sizing: border-box;
  border-radius: 4px;
  text-align: center;
  margin-bottom: 2rem;
}

.email-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary);
}

.submit-button {
  width: 100%;
  background-color: var(--color-text);
  color: var(--color-background);
  font-family: var(--font-display);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border: none;
  padding: 1.25rem;
  cursor: pointer;
  font-size: 1.2rem;
  transition: background-color 0.3s ease;
}

.submit-button:hover:not(:disabled) {
  background-color: var(--color-primary);
}

.submit-button:disabled {
  background-color: var(--color-muted);
  cursor: not-allowed;
  opacity: 0.7;
}

.feedback-message {
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 4px;
  text-align: center;
  font-weight: 600;
  background-color: #eaf5e8; /* Softer Success Green */
  color: #3c763d;
  border: 1px solid #c8e6c9;
}

.feedback-message.is-error {
  background-color: #fce8e6; /* Softer Error Red */
  color: #c53929;
  border: 1px solid #f7c7c3;
}
</style>