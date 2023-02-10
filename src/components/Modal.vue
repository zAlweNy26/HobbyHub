<script setup lang="ts">
import { TransitionRoot, TransitionChild, Dialog, DialogPanel } from '@headlessui/vue'
import { ref } from 'vue'

const isCardOpen = ref(false)

const openCard = () => isCardOpen.value = true

const closeCard = () => isCardOpen.value = false

defineExpose({
    isCardOpen,
    openCard,
    closeCard
})
</script>

<template>
	<TransitionRoot appear :show="isCardOpen" as="template">
		<Dialog as="div" class="relative z-10" @close="closeCard">
			<TransitionChild as="template" enter="duration-200 ease-out" enter-from="opacity-0" enter-to="opacity-100"
				leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
				<div class="fixed inset-0 bg-base-100/50" />
			</TransitionChild>
			<div class="fixed inset-0 overflow-y-auto selection:bg-secondary-focus">
				<div class="flex min-h-full items-center justify-center p-4 text-center">
					<TransitionChild as="template" enter="duration-200 ease-out" enter-from="opacity-0 scale-95"
						enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
						leave-to="opacity-0 scale-95">
						<DialogPanel
							class="w-full max-w-3xl rounded-2xl bg-base-200 p-4 text-left align-middle text-neutral shadow-xl transition-all">
							<slot />
						</DialogPanel>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>
