<template>
  <section class="showcase-section">
    <div class="container">
      <h2 class="section-title">
        <span class="title-super">Case Studies</span>
        Selected Works
      </h2>
      <!-- 6. The v-for loop -->
      <div class="project-grid">
        <ProjectCard 
          v-for="project in projects" 
          :key="project.slug"
          :title="project.title"
          :subtitle="project.subtitle"
          :slug="project.slug"
          :imageUrl="project.cover_image_url"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '@/services/supabase'; // 1. Import our client
import ProjectCard from '@/components/ui/ProjectCard.vue';

// 2. A reactive variable to hold our array of projects
const projects = ref([]);

// 3. An async function to fetch the data
const fetchProjects = async () => {
  try {
    // 4. The Supabase query
    const { data, error } = await supabase
      .from('projects') // Select from our 'projects' table
      .select('title, slug, subtitle, cover_image_url') // Get only the columns we need for the card
      .eq('is_published', true) // Only fetch projects that are marked as published
      .order('display_order', { ascending: true }); // Order them by our custom sort order

    if (error) throw error; // If there's an error, stop and log it
    
    projects.value = data; // If successful, store the data in our reactive variable
  } catch (error) {
    console.error('Error fetching projects:', error.message);
  }
};

// 5. Call the fetch function when the component is mounted
onMounted(() => {
  fetchProjects();
  // ... (Your GSAP animation code can remain here)
});
</script>

<style scoped>
.showcase-section {
  /* The section itself is full-width with our stone gray background */
  width: 100%;
  background-color: var(--color-stone-gray);
  padding: 8rem 0;
  box-sizing: border-box;
}

.container {
  /* The content inside is centered and respects our max-width and padding */
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 4rem;
}

.section-title {
  text-align: center;
  margin-bottom: 5rem;
}

.title-super {
  display: block;
  font-family: var(--font-body);
  font-size: 1rem;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin-bottom: 0.5rem;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4rem;
}

@media (max-width: 768px) {
  .project-grid {
    grid-template-columns: 1fr;
  }
}
</style>