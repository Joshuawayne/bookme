<template>
  <!-- Show a simple loading message while fetching data -->
  <div v-if="isLoading" class="loading-state container">
    <h2>Loading Dossier...</h2>
  </div>
  
  <!-- If the project is found, display the main content -->
  <div v-else-if="project" class="project-dossier">
    <!-- Section 1: The Hero Image & Title -->
    <header class="dossier-header">
      <div class="header-image-container">
        <!-- Use the project's cover image, or fall back to the placeholder -->
        <img :src="project.cover_image_url || '/src/assets/placeholder.jpg'" :alt="project.title" />
      </div>
      <div class="header-content container">
        <h1 class="project-title">{{ project.title }}</h1>
        <p class="project-subtitle">{{ project.subtitle }}</p>
      </div>
    </header>

    <!-- Section 2: The Main Content Grid -->
    <div class="dossier-body container">
      <div class="main-content">
        <!-- 
          The v-html directive renders the 'content_body' from Supabase.
          This allows you to use simple HTML tags like <h2> and <p> in your database content.
          For more complex content, we can use a Markdown-to-HTML library later.
        -->
        <div v-html="project.content_body"></div> 
      </div>

      <aside class="sidebar-content">
        <div class="details-box">
          <h3>Project Details</h3>
          <ul>
            <li><strong>Client:</strong> Fictional Luxury Brand</li> <!-- This can be made dynamic later -->
            <li v-if="project.year"><strong>Year:</strong> {{ project.year }}</li>
            <li v-if="project.role"><strong>Role:</strong> {{ project.role }}</li>
            <li v-if="project.live_site_url">
              <strong>Live Site:</strong> <a :href="project.live_site_url" target="_blank" rel="noopener noreferrer">View Project →</a>
            </li>
          </ul>
        </div>
        <div class="details-box" v-if="project.tech_stack && project.tech_stack.length">
          <h3>Technology Stack</h3>
          <ul>
            <li v-for="tech in project.tech_stack" :key="tech">{{ tech }}</li>
          </ul>
        </div>
      </aside>
    </div>
  </div>

  <!-- If no project is found after loading, show an error message -->
  <div v-else class="error-state container">
    <h2>Project Not Found</h2>
    <p>The requested project dossier could not be found. Please check the URL or return to the homepage.</p>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router'; // Import to access URL parameters
import { supabase } from '@/services/supabase'; // Import our Supabase client

const route = useRoute(); // Get access to the current route object
const project = ref(null); // A reactive variable to hold the fetched project data
const isLoading = ref(true); // A flag to know when data is being loaded

/**
 * An asynchronous function to fetch data for a single project from Supabase
 * based on the 'slug' from the URL.
 */
const fetchProject = async (slug) => {
  isLoading.value = true;
  project.value = null; // Clear old data before fetching new data

  try {
    const { data, error } = await supabase
      .from('projects') // The table name
      .select('*') // Get all columns for the detail page
      .eq('slug', slug) // Find the row where the 'slug' column matches our URL parameter
      .single(); // We expect only one project to match

    if (error) {
      // If Supabase returns an error (e.g., no rows found), throw it to the catch block
      throw error;
    }
    
    // If successful, store the fetched project data in our reactive variable
    project.value = data;
  } catch (error) {
    console.error('Error fetching project:', error.message);
    // The project ref will remain null, causing the error message to show
  } finally {
    // This will run whether the fetch succeeded or failed
    isLoading.value = false;
  }
};

// 'watch' is a Vue feature that runs a function whenever a specified value changes.
// We are watching the 'slug' parameter in the URL.
watch(
  () => route.params.slug, // The value to watch
  (newSlug) => {           // The function to run when it changes
    if (newSlug) {
      fetchProject(newSlug);
    }
  },
  { immediate: true } // This option tells the watcher to run immediately when the component loads
);
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 4rem;
}

.loading-state, .error-state {
  text-align: center;
  padding: 8rem 0;
}

/* Header Section */
.dossier-header {
  margin-bottom: 6rem;
}
.header-image-container {
  width: 100%;
  height: 60vh;
  overflow: hidden;
  background-color: var(--color-stone-gray);
}
.header-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.header-content {
  margin-top: -5rem;
  position: relative;
  z-index: 2;
  background-color: var(--color-background);
  padding-top: 3rem;
  padding-bottom: 3rem;
  border: 1px solid #e0e0e0;
  border-top: none;
}
.project-title {
  margin: 0;
  font-size: 3.5rem;
}
.project-subtitle {
  font-family: var(--font-body);
  font-size: 1.5rem;
  color: var(--color-muted);
  margin-top: 1rem;
  max-width: 30em;
}

/* Body Section */
.dossier-body {
  display: grid;
  grid-template-columns: 2.5fr 1fr;
  gap: 5rem;
  align-items: flex-start;
  padding-bottom: 8rem;
}
.main-content :deep(h2) { /* Use :deep() to style content coming from v-html */
  font-size: 2rem;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 1rem;
  margin-bottom: 2rem;
  margin-top: 4rem;
}
.main-content :deep(p) {
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 1.5rem;
}
.main-content :deep(figure) {
  margin: 4rem 0;
}
.main-content :deep(img) {
  width: 100%;
  height: auto;
  display: block;
  border: 1px solid #e0e0e0;
}
.main-content :deep(figcaption) {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: var(--color-muted);
  font-style: italic;
}

/* Sidebar Section */
.sidebar-content {
  position: sticky;
  top: 140px; /* Stick below the header */
}
.details-box {
  border: 1px solid #e0e0e0;
  padding: 1.5rem;
  margin-bottom: 2rem;
  background-color: var(--color-background);
}
.details-box h3 {
  font-family: var(--font-display);
  font-size: 1.2rem;
  margin-top: 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 1rem;
}
.details-box ul {
  list-style: none;
  padding: 0;
  margin: 0;
  font-family: var(--font-body);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.details-box a {
  font-weight: 600;
  text-decoration: none;
}
.details-box a:hover {
  text-decoration: underline;
}

/* Responsive adjustments */
@media (max-width: 900px) {
  .dossier-body {
    grid-template-columns: 1fr;
  }
  .sidebar-content {
    position: static; /* Unstick the sidebar on smaller screens */
  }
}
</style>