<!-- pages/index.vue -->
<template>
    <div class="relative h-lvh flex items-end justify-center pb-12">
        <div class="absolute inset-0 w-fullh-full flex items-center justify-center pointer-events-none">
            <h1 class="text-bigTitle text-center italic text-primary">
                <p v-for="title in homepage.hero_title" :key="title.id">
                    <span :class="{'font-bold': title.children[0]?.bold}">
                        {{ title.children[0]?.text }}
                    </span>
                </p>
            </h1>
        </div>

        <div class="relative z-10 pointer-events-none">
            <p class="a text-center" v-for="paragraph in homepage.hero_description" :key="paragraph">
                <span v-for="child in paragraph.children" :key="child" :class="{'text-secondary italic': child.italic}">
                    {{ child?.text }}
                </span>
            </p>
        </div>

        <!-- Vidéos -->
        <div class="players" v-if="homepage.videos">
            <div class="player--fallow" v-for="video in homepage.videos" :key="video.id">
                <VimeoPlayer class="w-full h-full" :videoId="video.video_url" />
            </div>
        </div>
    </div>
</template>
  
<script setup>
    import { ref, onMounted } from 'vue'
    import VimeoPlayer from '~/components/VimeoPlayer.vue'
    
    // Déclarer une variable réactive pour stocker les données
    const homepage = ref({
        hero_title: '',
        hero_description: '',
        videos: [],
    })
    
    // Récupérer les données au montage du composant
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
    /* Styles spécifiques à la page homepage */
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
        @apply fixed;
    }

    .player--fallow {
        @apply w-[27.3rem] h-[15.8rem];
    }
</style>