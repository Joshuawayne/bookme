<template>
  <!-- Pass the toggle function to the header and listen for the event -->
  <TheHeader @toggle-nav="toggleNav" />
  
  <!-- The Navigation component, which is shown/hidden by the isNavActive state -->
  <TheNavigation :is-active="isNavActive" @close-nav="closeNav" />

  <TheCurtain /> 
  <main>
    <router-view />
  </main>
  <TheFooter />
  
  <!-- Add Chatbot component -->
  <Chatbot />
</template>

<script setup>
import { ref } from 'vue';
import TheHeader from '@/components/global/TheHeader.vue';
import TheNavigation from '@/components/global/TheNavigation.vue';
import TheFooter from '@/components/global/TheFooter.vue';
import TheCurtain from '@/components/global/TheCurtain.vue';
import Chatbot from '@/components/Chatbot.vue'; // Import Chatbot component

// 1. A reactive variable to track if the nav is open or closed.
const isNavActive = ref(false);

// 2. A function to toggle the state. This is called by the header.
const toggleNav = () => {
  isNavActive.value = !isNavActive.value;
};

// 3. A function to explicitly close the nav. This will be called by the nav links.
const closeNav = () => {
  isNavActive.value = false;
};
</script>

<style>
/* 
  These styles apply globally to your main content area, solving the 
  layout overlap with the fixed header.
*/
main {
 
  padding-top: 50px;

  /* 
    ALIGNMENT: These match the horizontal padding of your header (padding: 0 4rem) 
    to ensure the content on the page aligns perfectly with the header content.
  */
  padding-left: 4rem;
  padding-right: 4rem;

  /* Optional but recommended: add some space at the bottom of the page */
  padding-bottom: 4rem;
}
</style>
