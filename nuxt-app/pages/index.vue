<template>
    <div class="relative h-lvh flex items-end justify-center" @mousemove="handleMouseMove">
        <div class="absolute z-20 inset-0 w-full h-full flex items-center justify-center pointer-events-none">
            <h1 class="text-bigTitle text-center italic text-primary">
                <p v-for="title in homepage.hero_title" :key="title.id">
                    <span :class="{'font-bold': title.children[0]?.bold}">
                        {{ title.children[0]?.text }}
                    </span>
                </p>
            </h1>
        </div>

        <div class="relative z-20 pointer-events-none pb-12">
            <p class="a text-center" v-for="paragraph in homepage.hero_description" :key="paragraph">
                <span v-for="child in paragraph.children" :key="child" :class="{'text-secondary italic': child.italic}">
                    {{ child?.text }}
                </span> 
            </p>
        </div>

        <div class="players" v-if="homepage.videos" ref="playersWrapper">
            <div class="player--fallow" v-for="(video, index) in homepage.videos" :key="video.id" ref="videoPlayers" @click="handleVideoClick(index)">
                <div class="relative w-full h-full overflow-hidden rounded-[1rem]">
                    <p class="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-white italic" v-if="index === 0">Découvrir mes derniers  projets</p>
                    <img v-if="video.thumbnail?.url" :src="getImageUrl(video.thumbnail.url)" alt="{{ video.thumbnail.name }}" class="video-thumbnail">
                    <VimeoPlayer class="w-full h-full" :videoId="video.video_url" />
                </div>
            </div>
        </div>
    </div>
</template>



<script setup>
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import VimeoPlayer from '~/components/VimeoPlayer.vue'

const homepage = ref({
    hero_title: '',
    hero_description: '',
    videos: [],
})

const videoPlayers = ref([])
const playersWrapper = ref(null)
const isFullscreen = ref(false) // Ajout d'un état pour vérifier si on est en fullscreen
const activeVideoIndex = ref(null) // Stocke l'index de la vidéo active

const mouseX = ref(0)
const mouseY = ref(0)

const getImageUrl = (image) => {
    return `http://localhost:1337${image}`
}

const handleMouseMove = (event) => {
    if (isFullscreen.value) return // Désactiver le follow mouse en plein écran

    mouseX.value = event.clientX
    mouseY.value = event.clientY

    videoPlayers.value.forEach((el, index) => {
        const videoWidth = el.offsetWidth
        const videoHeight = el.offsetHeight
        const delay = index * 0.05

        let newX = mouseX.value - videoWidth / 2
        let newY = mouseY.value - videoHeight / 2

        const wrapperRect = playersWrapper.value.getBoundingClientRect()
        const maxX = wrapperRect.right - videoWidth
        const maxY = wrapperRect.bottom - videoHeight
        const minX = wrapperRect.left
        const minY = wrapperRect.top

        newX = Math.max(minX, Math.min(newX, maxX))
        newY = Math.max(minY, Math.min(newY, maxY))

        gsap.to(el, {
            x: newX - wrapperRect.left,
            y: newY - wrapperRect.top,
            zIndex: 5 - index,
            delay,
            ease: "expo.out",
            duration: 0.4,
        })
    })
}

const handleVideoClick = (index) => {
    if (isFullscreen.value) {
        gsap.to(videoPlayers.value[index], {
            width: '27.3rem',
            height: '15.8rem',
            x: 0,
            y: 0,
            zIndex: 0,
            duration: 0.5,
            ease: "expo.out",
        })
        isFullscreen.value = false
        activeVideoIndex.value = null
    } else {
        const el = videoPlayers.value[index]
        const videoRect = el.getBoundingClientRect()

        const centerX = window.innerWidth / 2 - videoRect.width / 2
        const centerY = window.innerHeight / 2 - videoRect.height / 2

        gsap.to(el, {
            width: '90vw',
            height: '90vh',
            x: centerX - videoRect.left,
            y: centerY - videoRect.top,
            zIndex: 100,
            duration: 0.5,
            ease: "expo.out",
        })
        isFullscreen.value = true
        activeVideoIndex.value = index
    }
}

onMounted(async () => {
    try {
        const response = await $fetch('http://localhost:1337/api/homepage?populate[videos][populate]=thumbnail')
        const data = response.data

        homepage.value.hero_title = data.hero_title
        homepage.value.hero_description = data.hero_description
        homepage.value.videos = data.videos
        
    } catch (error) {
        console.error('Erreur lors de la récupération des données:', error)
    }
})
</script>

<style scoped>
    img {
        max-width: 100%;
        height: auto;
    }

    .text-bigTitle {
        font-size: 8rem;
        line-height: 1;

        @media screen and (min-width: 1024px) {
            font-size: 18rem;
            line-height: 1;

            span {
                font-size: 19rem;
                line-height: 19rem;
            }   
        }
    }

    .players {
        @apply fixed z-10 w-full h-full overflow-hidden;
    }

    .player--fallow {
        @apply absolute w-[27.3rem] h-[15.8rem];
    }

    .video-thumbnail {
        @apply absolute w-full h-full object-cover;
    }

    /* Style pour la vidéo en plein écran */
    .fullscreen {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%); /* Centrer la vidéo */
        width: 90vw; /* Largeur de la vidéo en plein écran */
        height: 90vh; /* Hauteur de la vidéo en plein écran */
        z-index: 100;
        background-color: black; /* Contexte noir autour de la vidéo */
        border-radius: 1rem; /* Arrondir les bords de la vidéo */
        transition: all 0.5s ease-in-out; /* Ajout d'une transition fluide */
    }

    /* Assurez-vous que la vidéo est en full width et cover */
    .fullscreen .video-thumbnail, .fullscreen vimeo-player {
        width: 100%;
        height: 100%;
        object-fit: cover; /* Maintenir les proportions de la vidéo */
    }
</style>
