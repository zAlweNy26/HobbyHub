<script setup lang="ts">
import { Icon } from '@iconify/vue'
import Tooltip from '@components/Tooltip.vue'
import { useHeaderStore } from '@stores/headerStore'
import { storeToRefs } from 'pinia'
import type { IOption } from '@/interfaces'
import { ref } from 'vue'

const props = defineProps<{
    tooltip: string,
    handler: "sortings" | "filters",
    category: string,
    values: IOption[],
    icon: string
}>()

const showMenu = ref(false)

const header = useHeaderStore()
const headerRefs = storeToRefs(header)

const handler = headerRefs[props.handler]
const category = props.category as keyof typeof handler.value

const toggleMenu = (val: string) => {
    const indexVal = props.values.findIndex(e => e.value == val)
    if (handler.value[category] == indexVal) handler.value[category] = 0 as never
    else {
        handler.value[category] = indexVal as never
        showMenu.value = !showMenu.value
    }
}
</script>

<template>
    <div class="relative flex">
        <Transition enter-active-class="transition ease-out" enter-from-class="transform opacity-0"
            enter-to-class="transform opacity-100" leave-active-class="transition ease-in"
            leave-from-class="transform opacity-100" leave-to-class="transform opacity-0">
            <div v-if="showMenu"
                class="absolute flex flex-col items-center gap-2 p-1 -ml-1 rounded-lg top-full bg-base-200">
                <Tooltip v-for="(e, i) in values" :key="e.value" :content="e.value">
                    <button class="btn btn-sm btn-ghost btn-square"
                        :class="{ '!btn-primary': handler[category] == i as never }" :aria-label="e.value"
                        @click="toggleMenu(e.value)">
                        <Icon :icon="e.icon" class="w-6 h-6" />
                    </button>
                </Tooltip>
            </div>
        </Transition>
        <Tooltip :content="tooltip">
            <button class="btn btn-sm btn-ghost btn-square"
                :class="{ '!btn-secondary': handler[category] != '' as never }" :aria-label="tooltip"
                @click="showMenu = !showMenu">
                <Icon :icon="icon" class="w-6 h-6" />
            </button>
        </Tooltip>
    </div>
</template>