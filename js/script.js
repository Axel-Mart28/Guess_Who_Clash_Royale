// Esperamos a que la página cargue completamente
document.addEventListener("DOMContentLoaded", () => {
    
    // Obtenemos los elementos de HTML que necesitamos
    const introOverlay = document.getElementById("intro-overlay");
    const btnPlayIntro = document.getElementById("btn-play-intro");
    const video = document.getElementById("supercell-video");
    const screenStart = document.getElementById("screen-start");

    // Cuando el usuario haga clic en "Tocar para iniciar"
    btnPlayIntro.addEventListener("click", () => {
        btnPlayIntro.style.display = "none"; // Ocultamos el botón
        video.style.display = "block";       // Mostramos el video
        video.play();                        // ¡Le damos Play al video!
    });

    // Cuando el video termine de reproducirse ("ended")
    video.addEventListener("ended", () => {
        // Desaparecemos la pantalla negra con un efecto suave
        introOverlay.style.opacity = "0";
        introOverlay.style.transition = "opacity 0.5s ease";
        
        // Esperamos medio segundo a que termine la transición y luego mostramos el menú principal
        setTimeout(() => {
            introOverlay.style.display = "none";
            screenStart.style.display = "block"; // Mostramos la Pantalla 1
        }, 500);
    });

});