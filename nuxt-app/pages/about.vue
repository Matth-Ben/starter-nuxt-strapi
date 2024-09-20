<!-- pages/about.vue -->
<template>
    <div>
        <!-- Titre de la page -->
        <h1>{{ about.about_title }}</h1>
        
        <!-- Description -->
        <div v-if="about.about_descr">
            <p v-for="paragraph in about.about_descr" :key="paragraph.id">
                {{ paragraph.children[0]?.text }}
            </p>
        </div>
    
        <!-- Highlighted content -->
        <div v-if="about.about_highlighted">
            <p v-for="paragraph in about.about_highlighted" :key="paragraph.id">
                {{ paragraph.children[0]?.text }}
            </p>
        </div>
    
        <!-- Contenu -->
        <div v-if="about.about_content">
            <p v-for="paragraph in about.about_content" :key="paragraph.id">
                {{ paragraph.children[0]?.text }}
            </p>
        </div>
    
        <!-- Image -->
        <div v-if="about.image">
            <img :src="getImageUrl(about.image)" alt="Image de la page About">
        </div>
    
        <!-- Vidéos -->
        <div v-if="about.videos">
            <div v-for="video in about.videos" :key="video.id">
                <VimeoPlayer :videoId="video.video_url" />
            </div>
        </div>
    </div>
</template>
  
<script setup>
  import { ref, onMounted } from 'vue'
  import VimeoPlayer from '~/components/VimeoPlayer.vue'
  
  const about = ref({
    about_title: '',
    about_descr: [],
    about_highlighted: [],
    about_content: [],
    videos: [],
    image: null,
  })
  
  const getImageUrl = (image) => {
    return `http://localhost:1337${image.url}`
  }
  
  onMounted(async () => {
    try {
      const response = await $fetch('http://localhost:1337/api/about?populate[image]=*&populate[videos]=*')
      const data = response.data
  
      about.value.about_title = data.about_title
      about.value.about_descr = data.about_descr
      about.value.about_highlighted = data.about_highlighted
      about.value.about_content = data.about_content
      about.value.videos = data.videos
      about.value.image = data.image
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error)
    }
  })
</script>