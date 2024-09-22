<template>
    <header>
        <nav class="container">
            <div class="relative z-50 flex items-center justify-between">
                <NuxtLink @click="handleLinkClick" to="/">Victor Ravinet</NuxtLink>
                <button @click="toggleMenu">{{ isMenuOpen ? 'Fermer' : 'Menu' }}</button>
            </div>
            <!-- Utilisation du composant transition avec v-show -->
            <Transition
                name="menu-slide"
                enter-active-class="transition-transform duration-300 ease-out"
                leave-active-class="transition-transform duration-300 ease-in"
            >
                <div v-if="isMenuOpen" class="menu">
                    <div class="relative h-full">
                        <ul class="menu--list">
                            <li v-for="menuItem in menu" :key="menuItem.id">
                                <NuxtLink :to="menuItem.path" @click="handleLinkClick">{{ menuItem.intitule }}</NuxtLink>
                            </li>
                        </ul>

                        <div class="absolute bottom-16 left-1/2 -translate-x-1/2">Say Hello</div>
                    </div>
                </div>
            </Transition>

        </nav>
    </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const menu = ref([])
const isMenuOpen = ref(false)

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
}

// Fonction pour fermer le menu lors du clic sur un lien
const handleLinkClick = () => {
    if (isMenuOpen.value) {
        isMenuOpen.value = false
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
/* Le menu est masqué initialement */
.menu {
    @apply fixed top-0 left-0 w-full h-full bg-white z-40;
}

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
</style>
