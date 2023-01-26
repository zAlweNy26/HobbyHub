<template>
	<label class="btn btn-sm btn-ghost btn-square text-base-100 swap" aria-label="Change theme">
		<input type="checkbox" class="modal-toggle" :checked="settings.isDark" @click="toggleTheme" />
		<Icon icon="eva:moon-fill" class="w-6 h-6 swap-off" />
		<Icon icon="eva:sun-fill" class="w-6 h-6 swap-on" />
	</label>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { onMounted } from 'vue'
import { useSettingsStore } from '@stores/settingsStore'

const settings = useSettingsStore()

function setTheme(dark: boolean) {
	document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
	localStorage.setItem('theme', dark ? 'dark' : 'light')
}

function toggleTheme() {
	setTheme(settings.isDark = !settings.isDark)
	window.dispatchEvent(new Event('storage'))
}

onMounted(() => {
	settings.isDark = localStorage.getItem("theme") === 'dark' ||
		(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
	setTheme(settings.isDark)
})
</script>