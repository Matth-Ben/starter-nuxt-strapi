<!-- pages/list-videos.vue -->
<template>
    <div>
      <h1>Liste des vidéos</h1>
  
      <!-- Vérifier s'il y a des vidéos -->
      <div v-if="videos.length">
        <div v-for="video in videos" :key="video.id" class="video-item">
            <nuxt-link :to="`/videos/${video.slug}`">
                <h2>{{ video.title }}</h2>
        
                <!-- Description (si disponible) -->
                <p v-for="(paragraph, index) in video.description" :key="index">
                    {{ paragraph.children[0]?.text }}
                </p>
        
                <div v-if="video.thumbnail">
                    {{ video.thumbnail.name }}
                    <img :src="getImageUrl(video.thumbnail)" alt="{{ video.thumbnail.name }}" class="thumbnail">
                </div>
            </nuxt-link>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  // Variable réactive pour stocker les vidéos
  const videos = ref([])
  
  // Fonction pour obtenir l'URL complète de la miniature
  const getImageUrl = (image) => {
    return `http://localhost:1337${image.url}`
  }
  
  // Récupérer les données lors du montage du composant
  onMounted(async () => {
    try {
      // Récupérer les vidéos avec les miniatures
      const response = await $fetch('http://localhost:1337/api/videos?populate=thumbnail')

      // Stocker les vidéos dans la variable réactive
      if (response && response.data) {
        console.log(response.data);
        
        videos.value = response.data
      } else {
        console.error('Aucune vidéo trouvée.')
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des vidéos:', error)
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
  