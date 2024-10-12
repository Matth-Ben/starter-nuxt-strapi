<template>
    <div>
        <div ref="vimeoContainer" class="vimeo-player"></div>
    </div>
</template>
  
<script setup>
    import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
    import Player from '@vimeo/player'
    
    const props = defineProps({
        videoId: {
            type: String,
            required: true
        }
    })
    
    const vimeoContainer = ref(null)
    let player = null
    
    onMounted(() => {
        // Créer une instance du player Vimeo avec l'ID reçu en prop
        createPlayer(props.videoId)
    })
    
    const createPlayer = (id) => {
        player = new Player(vimeoContainer.value, {
            id: id,
            width: 640,
            loop: false,
            autoplay: false,
            muted: false
        })
    
        // Ajouter des événements si nécessaire
        player.on('play', function () {
            console.log('La vidéo a commencé à jouer')
        })
    
        player.on('pause', function () {
            console.log('La vidéo est en pause')
        })
    }
    
    // Met à jour le player si l'ID vidéo change
    watch(() => props.videoId, (newId) => {
        if (player) {
            player.loadVideo(newId)
        } else {
            createPlayer(newId)
        }
    })
    
    onBeforeUnmount(() => {
        if (player) {
            player.destroy()
        }
    })
</script>
  
<style scoped>
    .vimeo-player {
        @apply block w-full h-full;
    }
</style>
  