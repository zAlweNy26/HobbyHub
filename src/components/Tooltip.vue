<!-- eslint-disable @typescript-eslint/no-non-null-assertion -->
<script setup lang="ts">
import { ref } from 'vue'
import type { Placement } from "@floating-ui/vue";
import { arrow as addArrow, computePosition, flip, offset, shift } from "@floating-ui/vue"

const props = withDefaults(defineProps<{
	content: string,
	disable?: boolean,
	arrow?: boolean,
    placement?: string
}>(), {
    disable: false,
    arrow: true,
    placement: "bottom"
})

const isHidden = ref(true)
const hoverRef = ref<HTMLElement>()
const tooltipRef = ref<HTMLElement>()
const arrowRef = ref<HTMLElement>()

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
                addArrow({ element: arrowRef.value! }),
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
				class="absolute top-0 left-0 z-40 w-max select-none rounded-md bg-neutral-focus px-2 py-1 text-xs font-bold text-base-100">
				<div v-if="props.arrow"
					ref="arrowRef" class="absolute h-2 w-2 rotate-45 bg-neutral-focus" />
				{{ props.content }}
			</div>
		</Transition>
	</div>
</template>