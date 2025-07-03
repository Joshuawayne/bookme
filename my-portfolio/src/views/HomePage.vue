<template>
  <div class="home-page-layout">
    <HeroSection id="home" />
    <ProjectShowcaseSection id="projects" />
    <PhilosophySection id="about" />
    <!-- THE FIX IS HERE: We are adding the ContactSection back in -->
    <ContactSection id="contact" /> 
  </div>
</template>

<script setup>
import HeroSection from '@/components/sections/HeroSection.vue';
import ProjectShowcaseSection from '@/components/sections/ProjectShowcaseSection.vue';
import PhilosophySection from '@/components/sections/PhilosophySection.vue';
// Import the component so we can use it
import ContactSection from '@/components/sections/ContactSection.vue';
</script>