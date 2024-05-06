// client/src/Components/PodcastEpisode.vue


<script setup lang="ts">
import Card from 'primevue/card';
import Button from 'primevue/button';

defineProps<{
    podcast: any
}>()
</script>

<template>
    <Card class="border border-surface-200 dark:border-surface-700 rounded-md m-2 p-3" style="margin:2em">
        <template #header>
            <img style="max-width:15em" alt="user header" :src=podcast.image_url />
        </template>

        <template #title> Podcast</template>
        <template #content>
            <div class="m-0" style="text-overflow: ellipsis;">
                {{ podcast.name.substring(0,20) }}
            </div>
        </template>
        <template #footer>
            <router-link :to="`/podcast/${podcast.id}`">
                <Button icon="pi pi-play" label="Play" />
            </router-link>
        </template>
    </Card>
</template>
