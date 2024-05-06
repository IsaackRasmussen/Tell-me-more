// client/src/Views/PodcastPlayer.vue

<script setup lang="ts">
import { ref } from "vue";
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Divider from 'primevue/divider';
import Fieldset from 'primevue/fieldset';

import Timeline from 'primevue/timeline';

</script>

<template>
    <div class="card">
        <div class="flex flex-col md:flex-row">
            <div class="w-full md:w-5/12 flex flex-col items-center justify-center gap-3 py-5">
                <Accordion :activeIndex="0">
                    <AccordionTab header="Podcast name">
                        <p class="m-0">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                            labore
                            et
                            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
                            ut
                            aliquip
                            ex ea commodo
                            consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                            fugiat
                            nulla
                            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                            mollit
                            anim
                            id est
                            laborum.
                        </p>
                    </AccordionTab>
                    <AccordionTab header="Episodes">
                        <p class="m-0">
                            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
                            laudantium,
                            totam
                            rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae
                            dicta
                            sunt
                            explicabo. Nemo
                            enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur
                            magni
                            dolores eos qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non
                            numquam
                            eius modi.
                        </p>
                    </AccordionTab>
                </Accordion>
            </div>
            <div class="w-full md:w-2/12">
                <Divider layout="vertical" />
                <Fieldset legend="Now playing">
                    <p class="m-0">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        labore
                        et
                        dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                        aliquip
                        ex ea commodo consequat.
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                        pariatur.
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim
                        id
                        est
                        laborum.
                    </p>
                </Fieldset>
            </div>
        </div>
    </div>
</template>