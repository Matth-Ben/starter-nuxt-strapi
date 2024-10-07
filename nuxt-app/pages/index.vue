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
            <div class="player--fallow" v-for="(video, index) in homepage.videos" :key="video.id" ref="videoPlayers">
                <VimeoPlayer class="w-full h-full" :videoId="video.video_url" />
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

const mouseX = ref(0)
const mouseY = ref(0)

const handleMouseMove = (event) => {
    mouseX.value = event.clientX
    mouseY.value = event.clientY

    videoPlayers.value.forEach((el, index) => {
        const videoWidth = el.offsetWidth
        const videoHeight = el.offsetHeight
        const delay = index * 0.05

        // Calculer les nouvelles positions
        let newX = mouseX.value - videoWidth / 2
        let newY = mouseY.value - videoHeight / 2

        // Appliquer les contraintes pour éviter de sortir du wrapper
        const wrapperRect = playersWrapper.value.getBoundingClientRect()
        const maxX = wrapperRect.right - videoWidth
        const maxY = wrapperRect.bottom - videoHeight
        const minX = wrapperRect.left
        const minY = wrapperRect.top

        // Contrainte de position
        newX = Math.max(minX, Math.min(newX, maxX))
        newY = Math.max(minY, Math.min(newY, maxY))

        // Appliquer les animations GSAP
        gsap.to(el, {
            x: newX - wrapperRect.left, // Translate par rapport à la position du wrapper
            y: newY - wrapperRect.top, // Translate par rapport à la position du wrapper
            zIndex: 5 - index,
            delay,
            ease: "expo.out",
            duration: 0.4,
        })
    })
}

onMounted(async () => {
    try {
        const response = await $fetch('http://localhost:1337/api/homepage?populate[videos]=*')
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
    @apply fixed z-10 w-full h-full overflow-hidden pt-24;
}

.player--fallow {
    @apply absolute w-[27.3rem] h-[15.8rem];
}
</style>
