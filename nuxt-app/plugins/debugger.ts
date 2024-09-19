export default defineNuxtPlugin((nuxtApp) => {
    if (process.server) return
    // Créer une superposition de débogage
    const debugOverlay = document.createElement('div')
    debugOverlay.style.position = 'fixed'
    debugOverlay.style.top = '0'
    debugOverlay.style.left = '0'
    debugOverlay.style.width = '100vw'
    debugOverlay.style.height = '100vh'
    debugOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'
    debugOverlay.style.color = '#fff'
    debugOverlay.style.display = 'none'
    debugOverlay.style.justifyContent = 'center'
    debugOverlay.style.alignItems = 'center'
    debugOverlay.style.fontSize = '24px'
    debugOverlay.style.zIndex = '9999'
    debugOverlay.innerHTML = '<div>Debug Mode Activated</div>'
  
    document.body.appendChild(debugOverlay)
  
    // Fonction pour basculer la visibilité de l'overlay
    const toggleDebugOverlay = () => {
        if (debugOverlay.style.display === 'none') {
            debugOverlay.style.display = 'flex'
        } else {
            debugOverlay.style.display = 'none'
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