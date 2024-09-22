<!-- pages/list-videos.vue -->
<template>
    <div>
      <h1>Liste des images</h1>
  
      <!-- Vérifier s'il y a des vidéos -->
      <div v-if="images.length">
        <div v-for="item in images" :key="item.id" class="image-item">
            <div v-if="item.image">
                <img :src="getImageUrl(item.image)" alt="{{ item.image.name }}" class="thumbnail">
            </div>
        </div>
      </div>
    </div>
  </template>
  
<script setup>
import { ref, onMounted } from 'vue'

const images = ref([])

const getImageUrl = (image) => {
    return `http://localhost:1337${image.url}`
}

onMounted(async () => {
    try {
        const response = await $fetch('http://localhost:1337/api/images?populate=image')

        if (response && response.data) {
            images.value = response.data
            console.log(images.value);
        } else {
            console.error('Aucune image trouvée.')
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des images:', error)
    }
})
</script>
  
<style scoped>
.thumbnail {
    max-width: 100%;
    height: auto;
    margin-top: 10px;
}
</style>
  