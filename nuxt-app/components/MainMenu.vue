<template>
    <header class="relative z-50">
      <nav class="container py-8">
        <div class="relative z-50 flex items-center justify-between">
          <NuxtLink @click="handleLinkClick" to="/">Victor Ravinet</NuxtLink>
          <button @click="toggleMenu">{{ isMenuOpen ? 'Fermer' : 'Menu' }}</button>
        </div>
  
        <!-- Transition pour le menu -->
        <Transition
          name="menu-slide"
          enter-active-class="transition-transform duration-500 delay-100 ease-in-out"
          leave-active-class="transition-transform duration-500 ease-in"
        >
          <div v-if="isMenuOpen" class="menu">
            <div class="relative h-full">
              <ul class="menu--list">
                <li class="menu--item" v-for="menuItem in menu" :key="menuItem.id">
                  <NuxtLink :to="menuItem.path" @click="handleLinkClick" class="menu--link">{{ menuItem.intitule }}</NuxtLink>
                </li>
              </ul>
              <div class="absolute bottom-16 left-1/2 -translate-x-1/2 italic text-[2.4rem]">Say Hello</div>
            </div>
          </div>
        </Transition>
      </nav>
    </header>
  </template>
  
<script setup>
  import { ref, onMounted, defineEmits } from 'vue'
  
  // Émettre l'événement de l'état du menu à App.vue
  const emit = defineEmits(['menuToggle'])
  
  const menu = ref([])
  const isMenuOpen = ref(false)
  
  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
    emit('menuToggle', isMenuOpen.value) // Émettre l'état du menu
  }
  
  // Fonction pour fermer le menu lors du clic sur un lien
  const handleLinkClick = () => {
    if (isMenuOpen.value) {
      isMenuOpen.value = false
      emit('menuToggle', isMenuOpen.value) // Émettre la fermeture du menu
    }
  }
  
  onMounted(async () => {
    try {
      const response = await $fetch('http://localhost:1337/api/navigations')
      menu.value = response.data.map(item => item)
    } catch (error) {
      console.error('Erreur lors de la récupération du menu:', error)
    }
  })
</script>
  
<style scoped>
  /* Menu */
  .menu {
    @apply fixed top-0 left-0 w-full h-full bg-white z-40;
  }
  
  /* Animation du menu pour la descente */
  .menu-slide-enter-from {
    @apply -translate-y-full;
  }
  
  .menu-slide-enter-to {
    @apply translate-y-0;
  }
  
  .menu-slide-leave-from {
    @apply translate-y-0;
  }
  
  .menu-slide-leave-to {
    @apply -translate-y-full;
  }
  
  /* Liste des éléments dans le menu */
  .menu--list {
    @apply flex items-center justify-center w-full h-full;
  }
  
  .menu--item {
    @apply block w-full h-full;
  }
  
  .menu--link {
    @apply flex items-center justify-center w-full h-full italic text-[2rem];
  }
</style>  