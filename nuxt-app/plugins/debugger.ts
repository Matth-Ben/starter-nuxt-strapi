export default defineNuxtPlugin((nuxtApp) => {
    if (process.server) return

    // Créer une superposition de débogage
    const debugOverlay = document.createElement('div')
    debugOverlay.classList.add('grid-helper')

    // Contenu de la grille
    debugOverlay.innerHTML = `
        <div class="grid grid-cols-6 lg:grid-cols-12 gap-8 h-full">
            <div class="col-span-1 h-full bg-primary opacity-50"></div>
            <div class="col-span-1 h-full bg-primary opacity-50"></div>
            <div class="col-span-1 h-full bg-primary opacity-50"></div>
            <div class="col-span-1 h-full bg-primary opacity-50"></div>
            <div class="col-span-1 h-full bg-primary opacity-50"></div>
            <div class="col-span-1 h-full bg-primary opacity-50"></div>
            <div class="col-span-1 h-full bg-primary opacity-50"></div>
            <div class="col-span-1 h-full bg-primary opacity-50"></div>
            <div class="col-span-1 h-full bg-primary opacity-50"></div>
            <div class="col-span-1 h-full bg-primary opacity-50"></div>
            <div class="col-span-1 h-full bg-primary opacity-50"></div>
            <div class="col-span-1 h-full bg-primary opacity-50"></div>
        </div>
    `

    document.body.appendChild(debugOverlay)

    // Fonction pour basculer entre les différents états de visibilité
    let visibilityState = 'none' // none, active, active-more
    const toggleDebugOverlay = () => {
        if (visibilityState === 'none') {
            debugOverlay.classList.add('active')
            visibilityState = 'active'
        } else if (visibilityState === 'active') {
            debugOverlay.classList.add('active-more')
            visibilityState = 'active-more'
        } else {
            debugOverlay.classList.remove('active')
            debugOverlay.classList.remove('active-more')
            visibilityState = 'none'
        }
    }

    // Écouter les événements de touches
    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.key === 'g') {
            event.preventDefault()
            toggleDebugOverlay()
        }
    })
})
