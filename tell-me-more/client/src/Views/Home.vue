// client/src/Views/PodcastPlayer.vue

<script setup lang="ts">
import { ref } from "vue";

import PodcastEpisode from '../components/PodcastEpisode.vue'
import Podcast from '../components/Podcast.vue'
import Carousel from 'primevue/carousel';
import Button from 'primevue/button';
import DataView from 'primevue/dataview';
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions'   // optional
import InputText from 'primevue/inputtext';
import Divider from 'primevue/divider';

import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';


import Card from 'primevue/card';


import Panel from 'primevue/panel';

// Global constant containing the API base URL -> /api
const baseURL = __API_PATH__;

// Reactive variables for managing loading state and response message
const isLoading = ref(false);
const feed_list = ref([]);
fetchFeeds().then((result) => feed_list.value = result);
var episode_list: any[] = [];
fetchEpisodes().then((result) => episode_list = result);

const search_results = ref([]);

var searchValue: string = "";


// Function to fetch data from the server
async function fetchFeeds() {
    try {
        // Set loading state to true
        isLoading.value = true;

        // Send a GET request to the server
        const response = await fetch(baseURL + "/feeds");

        // Parse the JSON response
        const data = await response.json();

        // Update the message with the response data
        return data.result;
    } catch (error) {
        // Handle errors
        console.error(error);
    } finally {
        // Reset loading state
        isLoading.value = false;
    }

    return [];
}

// Function to fetch data from the server
async function fetchEpisodes() {
    try {
        // Set loading state to true
        isLoading.value = true;

        // Send a GET request to the server
        const response = await fetch(baseURL + "/feeds/episodes");

        // Parse the JSON response
        const data = await response.json();

        // Update the message with the response data
        return data.result;
    } catch (error) {
        // Handle errors
        console.error(error);
    } finally {
        // Reset loading state
        isLoading.value = false;
    }

    return [];
}

async function searchVectorDb() {
    try {
        // Set loading state to true
        isLoading.value = true;
        const customHeaders = {
            "Content-Type": "application/json"
        }

        // Send a GET request to the server
        return await fetch(`${baseURL}/search`, { method: "POST", headers: customHeaders, body: JSON.stringify({ "Search": searchValue }) })
            .then((response) => response.json())
            .then(async (dataSearch: any) => {
                search_results.value = dataSearch.result;
            });
    } catch (error) {
        // Handle errors
        console.error(error);
    } finally {
        // Reset loading state
        isLoading.value = false;
    }

    search_results.value = [];
}

function GetEpisodeImage(id: number) {
    const episode = episode_list.find((elem: any) => elem.id == id);
    return episode.image_url;
}

function GetEpisodeTitle(id: number) {
    const episode = episode_list.find((elem: any) => elem.id == id);
    return episode.title;
}

</script>

<template>
    <div
        style="display:flex;flex: content;flex-direction: column;justify-content: space-around;margin:5em auto auto auto;width:50vw;max-width: 75vw">
        <Panel header="Prompt" style="margin-bottom: 2em;">
            <InputGroup>
                <InputText placeholder="Keyword" v-model="searchValue" />
                <Button icon="pi pi-search" severity="warning" @click="searchVectorDb" />
            </InputGroup>
            <div v-if="search_results.length > 0">
                <DataView :value="search_results" style="margin-top:2em" dataKey="">
                    <template #list="slotProps">
                        <div class="grid grid-nogutter">
                            <div v-for="(item, index) in slotProps.items" :key="index" class="col-12" style="margin-bottom: 0.5em;">

                                <div class="flex flex-col sm:flex-row sm:items-center p-4 gap-3"
                                    :class="{ 'border-t border-surface-200 dark:border-surface-700': index !== 0 }">
                                    <div class="md:w-[10rem] relative">
                                        <img style="max-width:3em" class="block xl:block mx-auto rounded-md w-full"
                                            :src="`${GetEpisodeImage(item[0])}`" :alt="item.name" />
                                    </div>
                                    <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-4">
                                        <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                                            <div>
                                                <span class="font-medium text-secondary text-sm">{{ item[1]
                                                    }}</span>
                                                <div style="font-weight: 600;"
                                                    class="text-lg font-medium text-surface-700 dark:text-surface-0/80 mt-2">
                                                    {{ GetEpisodeTitle(item[0]) }}</div>
                                            </div>
                                            <div class="bg-surface-100 dark:bg-surface-700 p-1"
                                                style="border-radius: 30px">
                                                <div class="bg-surface-0 dark:bg-surface-900 flex items-center gap-2 justify-center py-1 px-2"
                                                    style="border-radius: 30px; shadow-md: 0px 1px 2px 0px rgba(0, 0, 0, 0.04), 0px 1px 2px 0px rgba(0, 0, 0, 0.06)">
                                                    <span
                                                        class="text-surface-700 dark:text-surface-0/80 font-medium text-sm">{{
                    item.rating }}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="flex flex-col md:items-end gap-5">
                                            <div class="flex flex-row-reverse md:flex-row gap-2">
                                                Play
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Divider />
                            </div>
                        </div>
                    </template>
                </DataView>
            </div>
        </Panel>
        <Panel header="Recommended">
            <Carousel :value="feed_list" :numVisible="3" :numScroll="3"
                style="max-width:100vw;margin:0;padding:0;border:0">
                <template #item="slotProps">
                    <Podcast :podcast="slotProps.data"></Podcast>
                </template>
            </Carousel>
        </Panel>
    </div>
</template>