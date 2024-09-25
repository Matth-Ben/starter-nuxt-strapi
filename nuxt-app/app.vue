<template>
    <div>
        <MainMenu @menu-toggle="handleMenuToggle" />

        <div
            v-show="isMenuOpen"
            :class="{
                'opacity-0': !isOverlayVisible,
                'opacity-50': isOverlayVisible,
                'transition-opacity duration-300 ease-out': true
            }"
            class="fixed inset-0 bg-black z-40"
            @click="handleMenuToggle(false)"
        ></div>

        <main :class="{
            'scale-90': isMenuOpen,
            'transition-all origin-top duration-500 ease-out': true
        }">
            <NuxtPage />
        </main>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import MainMenu from '~/components/MainMenu.vue'

const isMenuOpen = ref(false)
const isOverlayVisible = ref(false) // Gérer l'opacité de l'overlay

const handleMenuToggle = (open) => {
    isMenuOpen.value = open
}

watch(isMenuOpen, (newVal) => {
    if (newVal) {
        setTimeout(() => {
            isOverlayVisible.value = true
        }, 10)
    } else {
        isOverlayVisible.value = false
    }
})
</script>

<style scoped>
/* Appliquer la transition pour le main */
main {
    @apply transform transition-transform duration-300 ease-out;
}
</style>