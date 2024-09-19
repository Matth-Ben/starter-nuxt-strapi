<!-- pages/about.vue -->
<template>
    <div>
        <h1>{{ about.about_title }}</h1>
        <p v-for="paragraph in about.about_content" :key="paragraph">
            {{ paragraph.children[0].text }}
        </p>
    </div>
</template>
  
<script setup>
    import { ref, onMounted } from 'vue'
    
    // Déclarer une variable réactive pour stocker les données de la page About
    const about = ref({
            about_title: '',
            about_content: ''
    })
  
    // Récupérer les données lors du montage du composant
    onMounted(async () => {
        try {
            const response = await $fetch('http://localhost:1337/api/about')
            const data = response.data
            
            about.value.about_title = data.about_title
            about.value.about_content = data.about_content
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error)
        }
    })
</script>
  
<style scoped>
  /* Styles spécifiques à la page about */
</style>