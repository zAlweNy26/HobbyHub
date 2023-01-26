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
    { name: 'Elden Ring', image: 'https://howlongtobeat.com/games/68151_Elden_Ring.jpg' },
    { name: 'Elden Ring', image: 'https://howlongtobeat.com/games/68151_Elden_Ring.jpg' },
    { name: 'Elden Ring', image: 'https://howlongtobeat.com/games/68151_Elden_Ring.jpg' },
    { name: 'Elden Ring', image: 'https://howlongtobeat.com/games/68151_Elden_Ring.jpg' },
    { name: 'Elden Ring', image: 'https://howlongtobeat.com/games/68151_Elden_Ring.jpg' },
    { name: 'Elden Ring', image: 'https://howlongtobeat.com/games/68151_Elden_Ring.jpg' },
])
</script>

<template>
    <div class="flex flex-wrap content-start grow" 
        :class="{ '!flex-col !gap-0 !p-2 !justify-start': viewMode != ViewMode.Grid, 'justify-around gap-4 p-4': viewMode == ViewMode.Grid }">
        <Card v-for="c in cards" :content="c" :mode="viewMode" />
    </div>
</template>