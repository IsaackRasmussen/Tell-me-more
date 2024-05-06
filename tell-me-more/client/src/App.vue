// client/src/App.vue

<script setup lang="ts">
import { ref } from "vue";
import PodcastEpisode from './components/PodcastEpisode.vue'
import Carousel from 'primevue/carousel';

import Panel from 'primevue/panel';

// Global constant containing the API base URL -> /api
const baseURL = __API_PATH__;

// Reactive variables for managing loading state and response message
const isLoading = ref(false);
const episodes = ref("");
episodes.value = [{ title: "card1", image_url: "https://d3t3ozftmdmh3i.cloudfront.net/production/podcast_uploaded_nologo/12892410/12892410-1613674549954-b2efc05b9037a.jpg" },
{ title: "card2", image_url: "https://d3t3ozftmdmh3i.cloudfront.net/production/podcast_uploaded_episode/28474490/28474490-1677244242837-3164194cdc0fe.jpg" },
{ title: "card3", image_url: "https://d3t3ozftmdmh3i.cloudfront.net/production/podcast_uploaded_nologo400/12736142/12736142-1613163197152-71ea1ef0e06b8.jpg" },
{ title: "card4", image_url: "https://d3t3ozftmdmh3i.cloudfront.net/production/podcast_uploaded_nologo/12736142/12736142-1613163199310-23fdc40a9a951.jpg" },
{ title: "card5", image_url: "https://d3t3ozftmdmh3i.cloudfront.net/production/podcast_uploaded_nologo/12736142/12736142-1613163199310-23fdc40a9a951.jpg" }];
//fetchAPI()

// Function to fetch data from the server
async function fetchAPI() {
  try {
    // Set loading state to true
    isLoading.value = true;

    // Send a GET request to the server
    const response = await fetch(baseURL + "/feeds");

    // Parse the JSON response
    const data = await response.json();

    // Update the message with the response data
    episodes.value = data.result;
  } catch (error) {
    // Handle errors
    episodes.value = [];
    console.error(error);
  } finally {
    // Reset loading state
    isLoading.value = false;
  }
}
</script>

<template>

  <!-- Button to trigger the fetchAPI function  --
  <div>
    <button @click="fetchAPI">Fetch</button>
  </div>-->

  <!-- Display loading message while fetching data  --
    <div v-if="isLoading">Loading...</div>

    <!-- Display the response message if available --
    <div v-else-if="message">-->
  <div style="flex: content;flex-direction: column;">
    <Panel header="Now playing"></Panel>
    <Panel header="Recommended">
      <Carousel :value="episodes" :numVisible="3" :numScroll="3" style="max-width:100vw;margin:0;padding:0;border:0">
        <template #item="slotProps">
          <PodcastEpisode :episode="slotProps.data"></PodcastEpisode>
        </template>
      </Carousel>
    </Panel>
  </div>
</template>