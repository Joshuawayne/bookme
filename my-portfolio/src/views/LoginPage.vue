<template>
  <div class="login-page">
    <div class="login-form-container">
      <h2>Admin Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" required>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" required>
        </div>
        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Logging in...' : 'Login' }}
        </button>
        <p v-if="errorMsg" class="error-message">{{ errorMsg }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from '@/services/supabase';

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMsg = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  isLoading.value = true;
  errorMsg.value = '';
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });
    if (error) throw error;
    
    // =======================================================
    // == THE FIX IS HERE ==
    // We are now redirecting to the correctly named 'AdminDashboard' route.
    // =======================================================
    router.push({ name: 'AdminDashboard' });

  } catch (error) {
    // This part is what is currently giving you the "No match for..." error.
    // After the fix above, this will no longer be triggered on a successful login.
    errorMsg.value = 'Failed to login. Please check your credentials.';
    console.error('Login error:', error.message);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.login-page { display: flex; justify-content: center; align-items: center; min-height: 80vh; }
.login-form-container { width: 100%; max-width: 400px; padding: 2rem; border: 1px solid #e0e0e0; border-radius: 4px; background-color: #fff; }
h2 { text-align: center; margin-top: 0; }
.form-group { margin-bottom: 1.5rem; }
label { display: block; margin-bottom: 0.5rem; font-weight: 600; }
input { width: 100%; padding: 0.75rem; font-size: 1rem; border-radius: 4px; border: 1px solid #ccc; box-sizing: border-box; }
button { width: 100%; padding: 1rem; font-size: 1.1rem; cursor: pointer; background-color: var(--color-text); color: var(--color-background); border: none; border-radius: 4px; }
button:disabled { background-color: var(--color-muted); }
.error-message { color: var(--color-primary); text-align: center; margin-top: 1rem; font-weight: 600; }
</style>