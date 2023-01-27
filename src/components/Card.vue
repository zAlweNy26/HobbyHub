<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ICard, ViewMode } from '@/interfaces'

const props = defineProps<{
    content: ICard,
    mode: ViewMode
}>()

const { name, image } = props.content
</script>

<template>
    <div v-if="mode == ViewMode.Grid" class="flex flex-col gap-1 cursor-pointer h-min w-fit">
        <div class="relative inline-block overflow-hidden rounded-lg hover:child-img:scale-110">
            <img class="object-cover object-center h-56 transition-all duration-200 select-none w-36" draggable="false" :src="image" />
            <p class="absolute bottom-0 left-0 w-full p-1 font-bold bg-base-100/75">{{ name }}</p>
        </div>
    </div>
    <div v-else-if="mode == ViewMode.Detail" class="flex w-full gap-2 p-2 transition-all rounded-lg cursor-pointer h-min hover:bg-base-300">
        <img class="object-cover object-center w-20 rounded-md select-none h-28" draggable="false" :src="image" />
        <div class="flex flex-col gap-1">
            <p class="font-bold">{{ name }}</p>
            <p class="text-sm font-medium">Tags</p>
        </div>
    </div>
    <div v-else-if="mode == ViewMode.Compact" class="flex flex-col w-full gap-1 p-2 transition-all rounded-lg cursor-pointer h-min hover:bg-base-300">
        <div class="flex items-center gap-1">
            <img class="object-cover object-center w-4 h-4 select-none" draggable="false" :src="image" />
            <p class="font-bold">{{ name }}</p>
        </div>
        <div class="flex items-center gap-1">
            <p class="text-sm font-medium">Tags</p>
        </div>
    </div>
</template>