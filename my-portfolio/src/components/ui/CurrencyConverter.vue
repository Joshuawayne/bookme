<template>
  <div class="converter-widget">
    <!-- Show a loading or error message based on the fetch status -->
    <div v-if="isLoading" class="status-message">Loading rates...</div>
    <div v-else-if="error" class="status-message error">{{ error }}</div>
    
    <!-- Only show the converter UI once the rates have been successfully fetched -->
    <div v-if="rates" class="converter-ui">
      <div class="form-group">
        <label for="kes-amount">Amount (KES)</label>
        <input type="number" id="kes-amount" v-model.number="kesAmount" placeholder="e.g., 100000" />
      </div>

      <div class="form-group">
        <label for="target-currency">Convert To</label>
        <select id="target-currency" v-model="targetCurrency">
          <option value="USD">USD - US Dollar</option>
          <option value="EUR">EUR - Euro</option>
          <option value="GBP">GBP - British Pound</option>
        </select>
      </div>

      <div class="result-box">
        <span class="result-label">Estimated Amount</span>
        <span class="result-amount">
          {{ convertedAmount }} 
          <span class="result-currency">{{ targetCurrency }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

// --- STATE ---
// Reactive variables to hold the component's state.
const kesAmount = ref(100000);
const targetCurrency = ref('USD');
const rates = ref(null); // Will store the fetched rates object { KES: ..., EUR: ... }
const isLoading = ref(true);
const error = ref(null);

// --- LOGIC ---
// onMounted is a Vue lifecycle hook that runs once the component is added to the page.
onMounted(async () => {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
    const url = `${apiUrl}/api/rates`;
    console.log('Fetching from:', url);
    const response = await fetch(url);
    console.log('Response status:', response.status, response.statusText);
    const text = await response.text();
    console.log('Raw response:', text);
    if (!response.ok) {
      throw new Error(`Failed to fetch rates: ${response.status} ${response.statusText}`);
    }
    const data = JSON.parse(text);
    rates.value = data.rates;
  } catch (e) {
    error.value = `Could not load currency data: ${e.message}`;
    console.error('Fetch error:', e);
  } finally {
    isLoading.value = false;
  }
});

// `computed` creates a reactive value that automatically recalculates
// whenever any of its dependencies (kesAmount, targetCurrency, rates) change.
const convertedAmount = computed(() => {
  // --- Defensive Guard Clauses ---
  // These checks prevent errors from happening before the data is ready.
  // 1. Check if the rates object and the specific currencies we need exist.
  if (!rates.value || !rates.value['KES'] || !rates.value[targetCurrency.value]) {
    return '...'; 
  }
  // 2. Check if the input amount is a valid number.
  if (typeof kesAmount.value !== 'number' || isNaN(kesAmount.value)) {
    return '0.00';
  }

  try {
    // --- The Calculation ---
    const kesPerUsd = rates.value['KES'];
    const targetPerUsd = rates.value[targetCurrency.value];
    
    // 1. Convert the input KES amount to the base currency (USD).
    const amountInUsd = kesAmount.value / kesPerUsd;
    // 2. Convert the USD amount to the final target currency.
    const result = amountInUsd * targetPerUsd;

    // Return the result formatted as a currency string.
    return result.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } catch (e) {
    console.error("Calculation error:", e);
    return 'Error';
  }
});
</script>

<style scoped>
/* All styles for this component are self-contained here. */
.converter-widget {
  border: 1px solid #e0e0e0;
  padding: 1.5rem;
  border-radius: 4px;
}
.status-message { text-align: center; color: var(--color-muted); }
.error { color: var(--color-primary); }
.form-group { margin-bottom: 1.5rem; }
.form-group:last-of-type { margin-bottom: 1rem; }
.form-group label { display: block; font-family: var(--font-body); font-weight: 600; font-size: 0.9rem; margin-bottom: 0.5rem; }
.form-group input, .form-group select {
  width: 100%;
  padding: 0.75rem;
  font-family: var(--font-body);
  font-size: 1.1rem;
  border: 1px solid #e0e0e0;
  background-color: var(--color-background);
  color: var(--color-text);
  box-sizing: border-box;
  border-radius: 4px;
}
.result-box {
  background-color: var(--color-stone-gray);
  padding: 1.5rem;
  text-align: center;
  border-radius: 4px;
}
.result-label { display: block; font-size: 0.9rem; color: var(--color-muted); text-transform: uppercase; letter-spacing: 0.1em; }
.result-amount { display: block; font-family: var(--font-display); font-size: 2.5rem; font-weight: 700; color: var(--color-primary); line-height: 1.2; margin-top: 0.5rem; }
.result-currency { font-size: 1.5rem; opacity: 0.7; }
</style>
