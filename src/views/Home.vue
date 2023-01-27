<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { reactive } from 'vue'
import Card from '@components/Card.vue'
import { useHeaderStore } from '@stores/headerStore'
import { ICard, ViewMode } from '@/interfaces'
import { storeToRefs } from 'pinia'

const header = useHeaderStore()
const { viewMode } = storeToRefs(header)

const cards = reactive<ICard[]>([
    { name: 'Unpacking', image: 'https://howlongtobeat.com/games/69666_Unpacking_(2021).jpg' },
    { name: 'Elden Ring', image: 'https://howlongtobeat.com/games/68151_Elden_Ring.jpg' },
    { name: 'Animal Crossing: New Horizons', image: 'https://howlongtobeat.com/games/68240_Animal_Crossing_New_Horizons.jpg' },
    { name: 'Dragon Quest XI: Echoes of an Elusive Age', image: 'https://howlongtobeat.com/games/39508_Dragon_Quest_XI_In_Search_of_Departed_Time.jpg' },
    { name: 'Cyberpunk 2077', image: 'https://howlongtobeat.com/games/Cyberpunk-2077-2.jpg' },
    { name: 'Rocket League', image: 'https://howlongtobeat.com/games/Rocket_League_header.jpg' }
])
</script>

<template>
    <div class="flex flex-wrap content-start grow" 
        :class="{ 'flex-col gap-0 p-2 justify-start': viewMode != ViewMode.Grid, 'justify-around gap-4 p-4': viewMode == ViewMode.Grid }">
        <Card v-for="c in cards" :content="c" :mode="viewMode" />
    </div>
</template>