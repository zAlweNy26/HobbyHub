<script setup lang="ts">
import { Icon } from '@iconify/vue'
import Tooltip from '@components/Tooltip.vue'
import Header from '@components/Header.vue'
import _ from 'lodash'
import Card from '@components/Card.vue'
import { usePageStore } from '@stores/pageStore'
import type { ICard } from '@/interfaces'
import { ViewMode, Order } from '@/interfaces'
import { storeToRefs } from 'pinia'
import { computed, watchEffect, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()

const isMaximized = ref(false), winTitle = ref("")

window.electron.getProperties().then(p => {
    isMaximized.value = p.isMaximized
    winTitle.value = p.title
})

window.electron.onResize((_, obj) => {
    isMaximized.value = obj.isMaximized
})

window.electron.onMessage((_, msg) => console.log(msg))

const windowAction = (action: 'minimize' | 'maximize' |'unmaximize' | 'close') => {
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

const page = usePageStore()
const { viewMode, sortings, filters, categories, cards, currentSection } = storeToRefs(page)

const computedCards = computed(() => {
    let sortedCards = _.cloneDeep(cards.value[currentSection.value])
    sortedCards.map((v, i) => _.assign(v, { index: i }))
    
    Object.keys(filters.value[currentSection.value]).forEach((f, i) => {
        const filter = Object.values(filters.value[currentSection.value])[i] as number
        if (filter != 0) {
            const opts = categories.value[currentSection.value].find(c => c.name.toLowerCase() == f)?.options?.map(o => o.value) ?? []
            sortedCards = sortedCards.filter(c => c.tags.find(t => t.type == f && t.value == opts[filter]))
        }
    })

    if (sortings.value[currentSection.value].alphabet == Order.Ascending) sortedCards.sort((c1, c2) => c1.name.localeCompare(c2.name))
    else if (sortings.value[currentSection.value].alphabet == Order.Descending) sortedCards.sort((c1, c2) => c2.name.localeCompare(c1.name))

    Object.keys(sortings.value[currentSection.value]).forEach((s, i) => {
        const sortingsValues = Object.values(sortings.value[currentSection.value])
        const sorting = sortingsValues[i]
        if (sorting != 0) {
            const opts = categories.value[currentSection.value].find(c => c.name.toLowerCase() == s)?.options?.map(o => o.value) ?? []
            sortedCards = [
                ...sortedCards.filter(c => c.tags.find(t => t.type == s)?.value == opts[sorting]),
                ...sortedCards.filter(c => c.tags.find(t => t.type == s)?.value != opts[sorting]).sort((c1, c2) => {
                    const c1Sort = opts.findIndex(o => o == c1.tags.find(t => t.type == s)?.value)
                    const c2Sort = opts.findIndex(o => o == c2.tags.find(t => t.type == s)?.value)
                    return sorting == 1 ? c1Sort - c2Sort : c2Sort - c1Sort
                })
            ]
        }
    })

    return sortedCards as (ICard & { index: number })[]
})

const templateCardRef = ref<InstanceType<typeof Card>>()
const cardsRefs = ref<InstanceType<typeof Card>[]>([])

window.electron.addCard(() => {
    if (cardsRefs.value.every(c => !c.modalCard?.isOpen)) templateCardRef.value?.openCard()
})

window.onbeforeunload = () => window.electron.saveDB(page.getJsonDB()) //TODO: controllare se funziona

const templateCard = ref<ICard>()

watchEffect(() => {
    templateCard.value = {
        name: i18n.t("card.name"), 
        image: '', 
        tags: categories.value[currentSection.value].map(c => { return { type: c.name.toLowerCase(), value: "None" } }), 
        added: 0, 
        updated: 0
    }
})
</script>

<template>
	<div class="flex flex-col h-screen min-h-screen transition-colors scroll-smooth bg-base-100 selection:bg-secondary-focus">
		<div class="min-h-0 p-0 select-none navbar shrink-0 bg-primary-focus" style="-webkit-app-region: drag">
			<div class="gap-2 ml-2 navbar-start">
				<img class="object-cover object-center w-4 h-4" draggable="false" src="/favicon.ico" alt="HobbyHub Logo">
				<p class="text-sm font-extrabold text-base-100">
					{{ winTitle }}
				</p>
			</div>
			<div class="navbar-end">
				<Tooltip :content="$t('toolbar.minimize')">
					<button tabindex="-1" class="rounded-none btn-ghost btn-xs btn text-base-100" :aria-label="$t('toolbar.minimize')"
						style="-webkit-app-region: no-drag" @click="windowAction('minimize')">
						<Icon icon="fluent:subtract-16-filled" class="w-5 h-5" />
					</button>
				</Tooltip>
				<Tooltip :content="isMaximized ? $t('toolbar.unmaximize') : $t('toolbar.maximize')">
					<button tabindex="-1" class="rounded-none btn-ghost btn-xs btn text-base-100" 
						:aria-label="isMaximized ? $t('toolbar.unmaximize') : $t('toolbar.maximize')"
						style="-webkit-app-region: no-drag" @click="windowAction(isMaximized ? 'unmaximize' : 'maximize')">
						<Icon :icon="isMaximized ? 'fluent:full-screen-minimize-16-filled' : 'fluent:full-screen-maximize-16-filled'" class="w-5 h-5" />
					</button>
				</Tooltip>
				<Tooltip :content="$t('toolbar.close')">
					<button tabindex="-1" class="rounded-none btn-ghost btn-xs btn text-base-100 hover:bg-error hover:brightness-90"
						:aria-label="$t('toolbar.close')" style="-webkit-app-region: no-drag" @click="windowAction('close')">
						<Icon icon="fluent:dismiss-16-filled" class="w-5 h-5" />
					</button>
				</Tooltip>
			</div>
		</div>
		<Header />
		<div class="flex flex-wrap content-start overflow-y-auto grow" :class="{
			'gap-2 p-2 justify-start': viewMode != ViewMode.Grid,
			'justify-around gap-4 p-4': viewMode == ViewMode.Grid
		}">
			<Card ref="templateCardRef" :content="templateCard!" :mode="viewMode" :index="-1" 
				@save="page.saveCard" />
			<Card v-for="(card, index) in computedCards" ref="cardsRefs" 
				:key="`${card.name}_${index}`" :content="card" :index="card.index" 
				:mode="viewMode" @delete="page.deleteCard" @save="page.saveCard" />
		</div>
	</div>
</template>