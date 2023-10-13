<script setup>
import HelloWorld from './components/HelloWorld.vue'
// import MobileMockup from './components/MobileMockup.vue'
</script>

<template>
  <div class="container mx-auto">
    <router-view />
  </div>

  <!-- <HelloWorld msg="Vite + Vue" /> -->
  <!-- <MobileMockup></MobileMockup> -->
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
