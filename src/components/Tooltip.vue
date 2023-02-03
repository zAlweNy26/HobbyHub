<script setup lang="ts">
import { ref } from 'vue'
import { arrow, computePosition, flip, offset, shift, Placement, ReferenceElement } from "@floating-ui/dom"

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
const hoverRef = ref<ReferenceElement>(), tooltipRef = ref<HTMLElement>(), arrowRef = ref<HTMLElement>()

async function calculatePosition() {
    const { x, y, middlewareData, placement } = await computePosition(
        hoverRef.value!,
        tooltipRef.value!,
        {
            placement: props.placement as Placement,
            middleware: [
                offset(8),
                flip(),
                shift({ padding: 8 }),
                arrow({ element: arrowRef.value! }),
            ],
        }
    );

    Object.assign(tooltipRef.value!.style, {
        left: `${x}px`,
        top: `${y}px`,
    });

    const arrowX = middlewareData.arrow?.x
    const arrowY = middlewareData.arrow?.y

    const opposedSide = {
        left: "right",
        right: "left",
        bottom: "top",
        top: "bottom",
    }[placement.split("-")[0]] ?? "";

    Object.assign(arrowRef.value!.style, {
        left: arrowX ? `${arrowX}px` : "",
        top: arrowY ? `${arrowY}px` : "",
        bottom: "",
        right: "",
        [opposedSide]: "-4px",
    });
}

const hide = () => {
    isHidden.value = true
}

const show = () => {
    isHidden.value = false
    calculatePosition()
}
</script>

<template>
    <div class="inline-flex">
        <div ref="hoverRef" class="inline-flex" @click="hide" @mouseenter="show"
            @mouseleave="hide" @focus="show" @blur="hide">
            <slot />
        </div>
        <Transition v-if="!disable" v-show="!isHidden" enter-active-class="transition ease-out"
            enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition ease-in"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div ref="tooltipRef"
                class="absolute top-0 left-0 z-40 px-2 py-1 text-xs font-bold rounded-md select-none bg-neutral-focus text-base-100 w-max">
                <div v-if="props.arrow"
                    class="absolute w-2 h-2 rotate-45 bg-neutral-focus" ref="arrowRef"></div>
                {{ props.content }}
            </div>
        </Transition>
    </div>
</template>