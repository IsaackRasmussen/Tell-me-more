// client/src/Components/PodcastEpisode.vue


<script setup lang="ts">
import Card from 'primevue/card';
import Button from 'primevue/button';

defineProps<{
    episode: any
}>()

function gotoEpisode() {
    
}

</script>

<template>
    <Card class="border border-surface-200 dark:border-surface-700 rounded-md m-2 p-3">
        <template #header>
            <img style="max-width:15em" alt="user header" :src=episode.image_url />
        </template>

        <template #title> {{ episode.title }} test3</template>
        <template #subtitle> Card subtitle </template>
        <template #content>
            <p class="m-0">
                {{ episode.title }}
            </p>
        </template>
        <template #footer>
            <Button icon="pi pi-play" label="Play" @click="gotoEpisode"/>
        </template>
    </Card>
</template>
