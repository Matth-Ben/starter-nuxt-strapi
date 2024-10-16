<!-- pages/about.vue -->
<template>
    <div>
        <div class="cover">
            <div class="relative flex justify-center w-full">
                <div class="image relative z-10 aspect-[446/546] max-w-[44.6rem]" v-if="about.image">
                    <img class="image-content" :src="getImageUrl(about.image.url)" alt="Image de la page About">
                </div>

                <div ref="marquee" class="marquee">
                    <span>{{ about.about_title }} - </span>
                    <span>{{ about.about_title }} - </span>
                </div>
            </div>

            <!-- Description -->
            <div class="text-center" v-if="about.about_descr">
                <p v-for="paragraph in about.about_descr" :key="paragraph.id">
                    <span v-for="child in paragraph.children" :key="child" :class="{'text-secondary italic': child.italic}">
                        {{ child?.text }}
                    </span>
                </p>
            </div>
        </div>
        
        <div class="container">
            <div class="grid grid-cols-12 gap-8 items-end my-48">
                <div class="col-span-12 lg:col-span-7">
                    <!-- Highlighted content -->
                    <div class="big-text italic lg:pl-20" v-if="about.about_highlighted">
                        <p v-for="paragraph in about.about_highlighted" :key="paragraph.id">
                            {{ paragraph.children[0]?.text }}
                        </p>
                    </div>
                </div>
                <div class="col-span-12 lg:col-span-4 !col-start-9">
                    <!-- Contenu -->
                    <div class="italic lg:pr-20" v-if="about.about_content">
                        <p v-for="paragraph in about.about_content" :key="paragraph.id">
                            {{ paragraph.children[0]?.text }}
                        </p>
                    </div>
                </div>
            </div>

            <!-- Vidéos avec animations GSAP -->
            <div v-if="about.videos" class="video-wrapper">
                <div class="relative w-full h-full bg-primary rounded-[1rem] overflow-hidden">
                    <nuxt-link class="absolute left-12 bottom-12 z-30 text-white italic" to="/videos">All my videos</nuxt-link>
                    <div v-for="(video, index) in about.videos" :key="video.id" class="video-container"
                        :class="{'is-large': index === currentVideoIndex, 'is-small': index !== currentVideoIndex}">
                        <img v-if="video.thumbnail?.url" :src="getImageUrl(video.thumbnail.url)" alt="{{ video.thumbnail.name }}" class="video-thumbnail">
                        <VimeoPlayer class="w-full h-full" :videoId="video.video_url" @play="onVideoPlay(index)" />
                    </div>
                </div>
            </div>

            <div class="contact my-48">
                <ul>
                    <li class="border-t last:border-b border-primary" v-for="contact in about.contact" :key="contact.id">
                        <NuxtLink class="link flex items-center justify-between w-full py-6 px-20" :to="contact.Url" v-bind:target="contact.Target ? '_blank' : null">
                            <span class="link-text">{{ contact.Texte }}</span>
                            <span class="link-svg" v-html="arrowSVG"></span>
                        </NuxtLink>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
  
<script setup>
    import { ref, onMounted, nextTick } from 'vue'
    import VimeoPlayer from '~/components/VimeoPlayer.vue'
    import Marquee from '~/utils/marquee';
    import gsap from 'gsap';

    const about = ref({
        about_title: '',
        about_descr: [],
        about_highlighted: [],
        about_content: [],
        videos: [],
        image: null,
    })

    const currentVideoIndex = ref(0);
    const nextVideoIndex = ref(1);
    const marquee = ref(null);
    const arrowSVG = ref('')

    const getImageUrl = (image) => {
        return `http://localhost:1337${image}`
    }

    // Animation GSAP pour les transitions
    const animateVideos = (current, next) => {
        const tl = gsap.timeline();

        // Transition pour la vidéo actuelle (sortie)
        tl.to(`.video-container.is-large`, {
            scale: 0.5,
            x: '50%',
            duration: 1,
            ease: 'power2.inOut'
        });

        // Transition pour la prochaine vidéo (entrée)
        tl.to(`.video-container.is-small`, {
            scale: 1,
            x: '0%',
            duration: 1,
            ease: 'power2.inOut',
            onComplete: () => {
                currentVideoIndex.value = next;
                nextVideoIndex.value = (next + 1) % about.value.videos.length;
            }
        }, '-=0.5');
    };

    // Gestion de la lecture des vidéos
    const onVideoPlay = (index) => {
        if (index !== currentVideoIndex.value) {
            animateVideos(currentVideoIndex.value, index);
        }
    };
  
    onMounted(async () => {
        try {
            const response = await $fetch('http://localhost:1337/api/about?populate[image]=*&populate[videos]=*&populate[Contact]=*')
            const responseThumbnail = await $fetch('http://localhost:1337/api/about?populate[videos][populate]=thumbnail')
            const data = response.data
        
            about.value.about_title = data.about_title
            about.value.about_descr = data.about_descr
            about.value.about_highlighted = data.about_highlighted
            about.value.about_content = data.about_content
            about.value.videos = responseThumbnail.data.videos
            about.value.image = data.image
            about.value.contact = data.Contact

            const responseSVG = await fetch('/_nuxt/assets/svg/arrow.svg')
            arrowSVG.value = await responseSVG.text()

            await nextTick();

            if (marquee.value) {
                new Marquee(marquee.value, 1);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error)
        }
    })
</script>

<style>
    .marquee {
        position: absolute;
        top: 50%;
        left: 0;
        display: flex;
        width: 100%;
        transform: translateY(-50%);
        overflow: hidden;
        white-space: nowrap;
    }

    .marquee span {
        display: inline-block;
        font-size: 10rem;
        line-height: 12rem;
        padding-right: 2rem;
    }

    .cover {
        @apply relative flex flex-col items-center justify-center gap-12 w-full h-lvh;
    }

    .image {
        @apply overflow-hidden rounded-[1rem];
    }

    .image-content {
        @apply w-full h-full object-cover;
    }

    .big-text {
        font-size: 6rem;
        line-height: 7.2rem;
    }

    .link {
        font-size: 3.5rem;
        line-height: 4.2rem;
        @apply relative italic overflow-hidden;

        &-text,
        &-svg {
            @apply relative z-10 transition duration-300 ease-in-out;
        }

        &:before {
            content: '';
            @apply absolute top-0 left-0 w-full h-full bg-primary translate-y-full transition duration-300 ease-in-out;
        }

        @media (hover: hover) {
            &:hover {
                &:before {
                    @apply translate-y-0;
                }

                .link-text {
                    @apply text-white;
                }

                .link-svg {
                    path {
                        @apply fill-white;
                    }
                }
            }
        }
    }

    .link-svg {
        @apply flex items-center justify-center w-[2.2rem] h-[2.9rem];

        path {
            @apply fill-primary transition duration-300 ease-in-out;
        }
    }

    .video-wrapper {
        @apply relative w-full h-auto lg:h-screen aspect-video;
    }

    .video-container {
        position: absolute;
        border-radius: 1rem;
        overflow: hidden;
        transition: transform 1s ease;
    }

    .video-container.is-large {
        @apply w-full h-full z-10;
        border-radius: 1rem;
    }

    .video-container.is-small {
        @apply bottom-12 right-12 z-20;
        width: 25rem;
        height: 14.5rem;
        transition: transform 1s ease;
    }
</style>