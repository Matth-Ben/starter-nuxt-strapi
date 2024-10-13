export default class Marquee {
    index = 0;
    firstElement;
    element;
    interval;
  
    constructor(element, speed = 0.4) {
        const clone = element.innerHTML;
        this.firstElement = element.children[0];
        this.element = element;
        this.speed = speed;
    
        // Minimum de 2 enfants
        element.insertAdjacentHTML('beforeend', clone);
    
        // Calculer la largeur totale des enfants
        let totalWidth = 0;
        Array.from(element.children).forEach(child => totalWidth += child.clientWidth);
    
        let index = 0; // Empêche la boucle infinie
    
        // Ajouter des clones tant que la largeur totale est inférieure à 3x la largeur de la fenêtre
        while (totalWidth < window.innerWidth * 3 && index < 100) {
            element.insertAdjacentHTML('beforeend', clone);
            totalWidth = 0; // Réinitialiser le calcul
            Array.from(element.children).forEach(child => totalWidth += child.clientWidth);
            index++;
        }
    
        // Lancer l'animation
        requestAnimationFrame(this.run);
    }
  
    run = () => {
        this.firstElement.style.marginLeft = `-${this.index}px`;
    
        if (this.index > this.firstElement.clientWidth) {
            this.index = 0; // Réinitialiser quand tout le texte a défilé
        }
    
        this.index = this.index + this.speed;
        requestAnimationFrame(this.run); // Boucle infinie de l'animation
    }
}
  