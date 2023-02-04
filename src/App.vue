<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Icon } from '@iconify/vue'
import Tooltip from '@components/Tooltip.vue'
import Header from '@components/Header.vue'
import { ref } from 'vue'

const isMaximized = ref(false), winTitle = ref("")

window.electron.getProperties().then(p => {
    isMaximized.value = p.isMaximized
    winTitle.value = p.title
})

window.electron.onResize((_, obj) => {
    isMaximized.value = obj.isMaximized
})

window.electron.onMessage((_, msg) => console.log(msg))

const windowAction = (action: string) => {
    switch (action) {
        case "minimize":
            window.electron.minimize()
            break
        case "maximize":
            window.electron.maximize()
            break
        case "unmaximize":
            window.electron.unmaximize()
            break
        case "close":
            window.electron.close()
            break
        default:
            break
    }
}
</script>

<template>
	<div class="flex h-screen min-h-screen flex-col scroll-smooth bg-base-100 transition-colors selection:bg-secondary-focus">
		<div class="navbar min-h-0 shrink-0 select-none bg-primary-focus p-0" style="-webkit-app-region: drag">
			<div class="navbar-start ml-2 gap-2">
				<img class="h-4 w-4 object-cover object-center" draggable="false" src="/favicon.ico">
				<p class="text-sm font-extrabold text-base-100">
					{{ winTitle }}
				</p>
			</div>
			<div class="navbar-end">
				<Tooltip content="Minimize window">
					<button tabindex="-1" class="btn-ghost btn-xs btn rounded-none text-base-100" aria-label="Minimize window"
						style="-webkit-app-region: no-drag" @click="windowAction('minimize')">
						<Icon icon="fluent:subtract-16-filled" class="h-5 w-5" />
					</button>
				</Tooltip>
				<Tooltip :content="isMaximized ? 'Unmaximize window' : 'Maximize window'">
					<button tabindex="-1" class="btn-ghost btn-xs btn rounded-none text-base-100" aria-label="Unmaximize window"
						style="-webkit-app-region: no-drag" @click="windowAction(isMaximized ? 'unmaximize' : 'maximize')">
						<Icon :icon="isMaximized ? 'fluent:full-screen-minimize-16-filled' : 'fluent:full-screen-maximize-16-filled'" class="h-5 w-5" />
					</button>
				</Tooltip>
				<Tooltip content="Close window">
					<button tabindex="-1" class="btn-ghost btn-xs btn rounded-none text-base-100 hover:bg-error hover:brightness-90"
						aria-label="Close window" style="-webkit-app-region: no-drag" @click="windowAction('close')">
						<Icon icon="fluent:dismiss-16-filled" class="h-5 w-5" />
					</button>
				</Tooltip>
			</div>
		</div>
		<Header />
		<RouterView />
	</div>
</template>