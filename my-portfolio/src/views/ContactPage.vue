<template>
  <div class="contact-page">
    <div class="container">
      <header class="page-header">
        <h1 class="page-title">Contact</h1>
        <p class="page-subtitle">
          I am currently available for new projects and collaborations. Let's discuss how we can build something exceptional together.
        </p>
      </header>

      <div class="contact-options-grid">
        <!-- ======================================================= -->
        <!-- Option 1: Direct Email (A simple, direct avenue) -->
        <!-- ======================================================= -->
        <div class="contact-card">
          <h3 class="card-title">Direct Inquiry</h3>
          <p class="card-description">For general inquiries, collaborations, or direct communication, please feel free to send me an email.</p>
          <a href="https://mail.google.com/mail/?view=cm&fs=1&to=mercyjoshu0@gmail.com" target="_blank">mercyjoshu0@gmail.com</a>
        </div>

        <!-- ======================================================= -->
        <!-- Option 2: Book a Call (The high-intent client path) -->
        <!-- ======================================================= -->
        <div class="contact-card">
          <h3 class="card-title">Schedule a Consultation</h3>
          <p class="card-description">The most efficient way to discuss a new project in detail. Book a complimentary 30-minute call directly on my calendar.</p>
          <router-link to="/consultation" class="card-link">Book a Call →</router-link>
        </div>

        <!-- ======================================================= -->
        <!-- Option 3: Structured Form (The lead-capture system) -->
        <!-- ======================================================= -->
        <div class="contact-card full-width">
          <h3 class="card-title">Send a Structured Message</h3>
          <p class="card-description">If you prefer, use the form below. Your message will be saved to my lead management system and a notification will be sent to my inbox.</p>
          
          <!-- The @submit.prevent directive calls our handleSubmit method -->
          <!-- and prevents the default browser form submission (page reload). -->
          <form class="contact-form" @submit.prevent="handleSubmit">
            <div class="form-row">
              <div class="form-group">
                <label for="name">Your Name</label>
                <input type="text" id="name" v-model="form.name" required>
              </div>
              <div class="form-group">
                <label for="email">Your Email</label>
                <input type="email" id="email" v-model="form.email" required>
              </div>
            </div>
            <div class="form-group">
              <label for="subject">Subject</label>
              <input type="text" id="subject" v-model="form.subject" required>
            </div>
            <div class="form-group">
              <label for="message">Message</label>
              <textarea id="message" rows="6" v-model="form.message" required></textarea>
            </div>
            
            <div class="submission-area">
              <button type="submit" class="submit-button" :disabled="isLoading">
                {{ isLoading ? 'Sending...' : 'Send Message' }}
              </button>
              <!-- This feedback message is conditionally rendered based on submission status -->
              <p v-if="feedbackMessage" class="feedback-message" :class="{ 'is-error': isError }">
                {{ feedbackMessage }}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// =======================================================
// SCRIPT: Handles the component's state and logic.
// =======================================================
import { reactive, ref } from 'vue';

// --- State Management ---
// These are reactive variables that control the UI during form submission.

// `isLoading` tracks the submission process to disable the button.
const isLoading = ref(false);

// `feedbackMessage` holds the text to show the user after submission (e.g., "Success!").
const feedbackMessage = ref('');

// `isError` is a boolean flag to style the feedback message differently for errors.
const isError = ref(false);

// `form` is a reactive object that uses v-model to bind to the form inputs.
// Using `reactive` is ideal for objects with multiple properties.
const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
});

// --- Business Logic ---
// This function orchestrates the entire contact form submission process.
const handleSubmit = async () => {
  // 1. Set Initial State: Prepare the UI for submission.
  isLoading.value = true;
  feedbackMessage.value = '';
  isError.value = false;

  try {
    // 2. API Call: Send the form data to our Node.js backend endpoint.
    // We use the modern `fetch` API for this network request.
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        // We explicitly tell the server we are sending JSON data.
        'Content-Type': 'application/json',
      },
      // We convert our JavaScript `form` object into a JSON string for transport.
      body: JSON.stringify(form)
    });

    // 3. Handle Response: Check if the server responded successfully.
    const result = await response.json();

    if (!response.ok) {
      // If the server returned an error (e.g., status 400 or 500),
      // we throw an error to be caught by our `catch` block.
      throw new Error(result.message || 'An unknown error occurred.');
    }

    // 4. Handle Success: Update the UI with a success message.
    feedbackMessage.value = result.message;
    
    // Reset the form fields for the next message.
    form.name = '';
    form.email = '';
    form.subject = '';
    form.message = '';

  } catch (error) {
    // 5. Handle Failure: If the `fetch` call or the server response failed,
    // this block will execute. We update the UI to show the error.
    feedbackMessage.value = error.message;
    isError.value = true;
    console.error('Contact form submission error:', error);
  } finally {
    // 6. Final State: This block runs regardless of success or failure,
    // ensuring the loading state is always turned off.
    isLoading.value = false;
  }
};
</script>

<style scoped>
/* ======================================================= */
/* STYLES: Defines the visual presentation of this page. */
/* ======================================================= */
.contact-page { padding: 6rem 0; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 4rem; }
.page-header { text-align: center; margin-bottom: 5rem; }
.page-title { margin-top: 0; }
.page-subtitle { font-size: 1.2rem; max-width: 35em; margin: 1rem auto 0 auto; opacity: 0.8; }

.contact-options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
.contact-card { border: 1px solid #e0e0e0; padding: 2.5rem; background-color: #fff; }
.full-width { grid-column: 1 / -1; margin-top: 2rem; }
.card-title { margin-top: 0; font-size: 1.5rem; border-bottom: 1px solid #e0e0e0; padding-bottom: 1rem; margin-bottom: 1.5rem; }
.card-description { opacity: 0.7; margin-bottom: 2rem; }
.card-link { font-weight: 600; font-size: 1.1rem; text-decoration: none; border-bottom: 2px solid var(--color-primary); padding-bottom: 0.25rem; }

.contact-form { display: flex; flex-direction: column; gap: 1.5rem; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
.form-group label { display: block; font-weight: 600; margin-bottom: 0.5rem; font-size: 0.9rem; }
.form-group input, .form-group textarea { width: 100%; padding: 0.75rem; font-size: 1rem; font-family: var(--font-body); border: 1px solid #ccc; border-radius: 4px; background-color: var(--color-background); box-sizing: border-box; }
.form-group textarea { resize: vertical; }

.submission-area { display: flex; align-items: center; gap: 1.5rem; margin-top: 1rem; }
.submit-button { align-self: flex-start; background-color: var(--color-text); color: var(--color-background); font-family: var(--font-display); text-transform: uppercase; letter-spacing: 0.1em; border: none; padding: 1rem 2rem; cursor: pointer; transition: background-color 0.3s ease; }
.submit-button:hover { background-color: var(--color-primary); }
.submit-button:disabled { background-color: var(--color-muted); cursor: not-allowed; }
.feedback-message { font-weight: 600; padding: 0.5rem 0; }
.feedback-message.is-error { color: var(--color-primary); }

@media (max-width: 768px) {
  .contact-options-grid, .form-row { grid-template-columns: 1fr; }
}
</style>
