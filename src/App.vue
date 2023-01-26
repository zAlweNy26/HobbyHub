<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from '@components/Header.vue'
</script>

<template>
  <div class="flex flex-col min-h-screen transition-colors selection:bg-secondary-focus bg-base-100 scroll-smooth" spellcheck="false">
    <Header />
    <main class="flex text-neutral grow">
      <RouterView />
    </main>
  </div>
</template>