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
            <img class="object-cover object-center w-48 h-auto transition-all duration-200 select-none" draggable="false" :src="image" />
            <p class="absolute bottom-0 left-0 w-full p-1 font-semibold bg-base-100/75">{{ name }}</p>
        </div>
    </div>
    <div v-else-if="mode == ViewMode.Detail" class="flex w-full gap-2 p-2 transition-all rounded-lg cursor-pointer h-min hover:bg-base-300">
        <img class="w-auto rounded-md h-28" draggable="false" :src="image" />
        <div class="flex flex-col gap-1">
            <p class="font-semibold">{{ name }}</p>
            <p class="text-sm font-medium">Tags</p>
        </div>
    </div>
    <div v-else-if="mode == ViewMode.Compact" class="flex flex-col w-full gap-1 p-2 transition-all rounded-lg cursor-pointer h-min hover:bg-base-300">
        <div class="flex items-center gap-1">
            <img class="w-4 h-4" draggable="false" :src="image" />
            <p class="text-sm font-semibold">{{ name }}</p>
        </div>
        <div class="flex items-center gap-1">
            <p class="text-xs font-medium">Tags</p>
        </div>
    </div>
</template>