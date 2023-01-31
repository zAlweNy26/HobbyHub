<script setup lang="ts">
import { ref } from 'vue'
import { flip, shift, offset, arrow, useFloating, autoUpdate, Placement } from '@floating-ui/vue'

const props = defineProps({
    content: String,
    disable: {
        type: Boolean,
        default: false
    },
    arrow: {
        type: Boolean,
        default: true
    },
    placement: {
        type: String,
        default: "bottom"
    }
})

const isHidden = ref(true)
const hoverRef = ref(null), tooltipRef = ref(null), arrowRef = ref(null)

const { x, y, strategy, middlewareData, placement } = useFloating(hoverRef, tooltipRef, {
    placement: props.placement as Placement,
    whileElementsMounted(...args) {
        const cleanup = autoUpdate(...args, { animationFrame: true })
        return cleanup
    },
    middleware: [offset(4), flip(), shift({ padding: 8 }), arrow({ element: arrowRef })],
})

const oppositeSides = { left: "right", right: "left", bottom: "top", top: "bottom" }

const opposedSide = oppositeSides[placement.value.split("-")[0] as keyof typeof oppositeSides]

const arrX = middlewareData.value.arrow?.x
const arrY = middlewareData.value.arrow?.y
</script>

<template>
    <div class="inline-flex">
        <div ref="hoverRef" class="inline-flex" @click="isHidden = true"
            @mouseenter="isHidden = false" @mouseleave="isHidden = true" 
            @focus="isHidden = false" @blur="isHidden = true">
            <slot />
        </div>
        <Transition v-if="!disable" v-show="!isHidden"
            enter-active-class="transition ease-out"
            enter-from-class="opacity-0" 
            enter-to-class="opacity-100"
            leave-active-class="transition ease-in"
            leave-from-class="opacity-100" 
            leave-to-class="opacity-0">
            <div ref="tooltipRef"
                :style="{ left: `${x ?? 0}px`, top: `${y ?? 0}px`, position: strategy, width: 'max-content' }"
                class="z-40 px-2 py-1 text-xs font-semibold transition-opacity rounded-md select-none bg-neutral-focus text-base-100">
                <div v-if="props.arrow" 
                    :style="{ left: arrX ? `${arrX}px` : '', top: arrY ? `${arrY}px` : '', bottom: '', right: '', [opposedSide]: '-2px'}"
                    class="absolute w-1 h-1 rotate-45 bg-neutral-focus" ref="arrowRef"></div>
                {{ props.content }}
            </div>
        </Transition>
    </div>
</template>