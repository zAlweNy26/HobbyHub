<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from '@components/Header.vue'
</script>

<template>
  <div class="flex flex-col h-screen min-h-screen transition-colors selection:bg-secondary-focus bg-base-100 scroll-smooth">
    <Header />
    <main class="flex overflow-y-auto text-neutral grow">
      <RouterView />
    </main>
  </div>
</template>