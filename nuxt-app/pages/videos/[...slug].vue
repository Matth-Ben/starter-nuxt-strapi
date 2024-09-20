<!-- pages/videos/[slug].vue -->
<template>
    <div v-if="video">
      <h1>{{ video.title }}</h1>
  
      <!-- Afficher la description -->
      <p v-for="(paragraph, index) in video.description" :key="index">
        {{ paragraph.children[0]?.text }}
      </p>
  
      <!-- Afficher la miniature -->
      <div v-if="video.thumbnail">
        <img :src="getImageUrl(video.thumbnail)" alt="Miniature de la vidéo" class="thumbnail">
      </div>
  
      <!-- Lien vidéo -->
      <div v-if="video.video_url">
        <VimeoPlayer :videoId="video.video_url" />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'

  console.log('Video page');
  
  
  // Utiliser le slug de l'URL pour récupérer les données de la vidéo
  const route = useRoute()
  const slug = route.params.slug
  
  // Variable réactive pour stocker les données de la vidéo
  const video = ref(null)
  
  // Fonction pour obtenir l'URL complète de la miniature
  const getImageUrl = (image) => {
    return `http://localhost:1337${image.url}`
  }
  
  // Récupérer les données de la vidéo lors du montage du composant
  onMounted(async () => {
    try {
      // Appeler l'API Strapi en filtrant par slug (ou autre identifiant unique)
      const response = await $fetch(`http://localhost:1337/api/videos?filters[slug][$eq]=${slug}&populate=thumbnail`)
  
      // Stocker la vidéo si elle existe
      if (response.data && response.data.length > 0) {
        video.value = response.data[0]
      } else {
        console.error('Aucune vidéo trouvée pour ce slug.')
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la vidéo:', error)
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
  