<template>
  <!-- The :to prop is now dynamic -->
  <router-link :to="{ name: 'ProjectDetail', params: { slug: slug } }" class="project-card-link">
    <div class="project-card">
      <div class="card-image-container">
        <!-- The image source is now dynamic -->
        <img :src="imageUrl || placeholderImage" alt="Project Cover Image" class="card-image">
      </div>
      <div class="card-content">
        <!-- The title and subtitle are now dynamic -->
        <h3 class="card-title">{{ title }}</h3>
        <p class="card-description">{{ subtitle }}</p>
        <!-- Tags can be made dynamic later -->
        <div class="card-tags">
          <span class="tag">Vue.js</span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup>
// Import the placeholder as a fallback
import placeholderImage from '@/assets/placeholder.jpg';

// Use defineProps to declare the data this component expects to receive
defineProps({
  title: String,
  subtitle: String,
  slug: String,
  imageUrl: String,
});
</script>

<style scoped>
/* All styles remain the same */
.project-card-link { display: block; text-decoration: none; color: inherit; }
.project-card { background-color: transparent; border-top: 1px solid var(--color-muted); padding-top: 1.5rem; transition: opacity 0.4s ease; }
.project-card:hover { opacity: 0.7; }
.project-card:hover .card-image { transform: scale(1.03); }
.card-image-container { width: 100%; overflow: hidden; margin-bottom: 1.5rem; }
.card-image { width: 100%; height: 250px; object-fit: cover; display: block; transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
.card-content { padding: 0 0.5rem; }
.card-title { font-size: 1.5rem; margin-bottom: 0.75rem; font-weight: 400; }
.card-description { font-family: var(--font-body); color: var(--color-text); opacity: 0.8; margin-bottom: 1.5rem; font-size: 1.1rem; }
.card-tags { display: flex; flex-wrap: wrap; gap: 0.75rem; }
.tag { font-family: var(--font-body); font-size: 0.9rem; color: var(--color-primary); border: 1px solid var(--color-primary); padding: 0.25rem 0.75rem; border-radius: 99px; }
</style>