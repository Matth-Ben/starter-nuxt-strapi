<!-- app.vue -->
<template>
    <div>
        <header>
            <nav>
                <div>
                    <NuxtLink to="/">Victor Ravinet</NuxtLink>
                </div>
                <ul>
                    <li v-for="menuItem in menu" :key="menuItem.id">
                        <NuxtLink :to="menuItem.path">{{ menuItem.intitule }}</NuxtLink>
                    </li>
                </ul>
            </nav>
        </header>
        
        <NuxtPage />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const menu = ref([])

onMounted(async () => {
    try {
        const response = await $fetch('http://localhost:1337/api/navigations')
        menu.value = response.data.map(item => item)
    } catch (error) {
        console.error('Erreur lors de la récupération du menu:', error)
    }
})
</script>

<style>
header, footer {
    padding: 20px;
    background: #f4f4f4;
    text-align: center;
}

nav a {
    margin: 0 10px;
    text-decoration: none;
    color: #333;
}

footer {
    margin-top: 40px;
}
</style>