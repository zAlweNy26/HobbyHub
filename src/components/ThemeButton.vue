<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { onMounted } from 'vue'
import { useSettingsStore } from '@stores/settingsStore'
import { storeToRefs } from 'pinia'

const settings = useSettingsStore()

const { isDark } = storeToRefs(settings)

function setTheme(dark: boolean) {
	document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
	localStorage.setItem('theme', dark ? 'dark' : 'light')
}

function toggleTheme() {
	setTheme(isDark.value = !isDark.value)
	window.dispatchEvent(new Event('storage'))
}

onMounted(() => {
	isDark.value = localStorage.getItem("theme") === 'dark' ||
		(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
	setTheme(isDark.value)
})
</script>

<template>
	<label class="px-2 btn-base-100 swap btn-sm btn" aria-label="Change theme">
		<input type="checkbox" class="modal-toggle" :checked="isDark" @click="toggleTheme">
		<Icon icon="eva:moon-fill" class="w-6 h-6 swap-off" />
		<Icon icon="eva:sun-fill" class="w-6 h-6 swap-on" />
		<p class="ml-8 text-sm capitalize">{{ isDark ? "Light" : "Dark" }}</p>
	</label>
</template>