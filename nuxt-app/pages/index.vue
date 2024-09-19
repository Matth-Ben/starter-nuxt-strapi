<!-- pages/index.vue -->
<template>
    <div>
        <h1>{{ homepage.hero_title }}</h1>
        <p v-for="paragraph in homepage.hero_description" :key="paragraph">
            {{ paragraph.children[0].text }}
        </p>
    </div>
</template>
  
<script setup>
    import { ref, onMounted } from 'vue'
    
    // Déclarer une variable réactive pour stocker les données
    const homepage = ref({
        hero_title: '',
        hero_description: '',
        hero_image_url: ''
    })
    
    // Récupérer les données au montage du composant
    onMounted(async () => {
        try {
            const response = await $fetch('http://localhost:1337/api/homepage')
            const data = response.data
            
            homepage.value.hero_title = data.hero_title
            homepage.value.hero_description = data.hero_description
            homepage.value.hero_image_url = data.hero_image.data.attributes.url // URL de l'image
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error)
        }
    })
</script>
  
<style scoped>
    /* Styles spécifiques à la page homepage */
    img {
        max-width: 100%;
        height: auto;
    }
</style>