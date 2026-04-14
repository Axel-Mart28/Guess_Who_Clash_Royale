// Esperamos a que la página cargue completamente
document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. LÓGICA DEL VIDEO INTRODUCTORIO
    // ==========================================
    const introOverlay = document.getElementById("intro-overlay");
    const btnPlayIntro = document.getElementById("btn-play-intro");
    const video = document.getElementById("supercell-video");
    const screenStart = document.getElementById("screen-start");

    // Cuando el usuario haga clic en "Tocar para iniciar"
    if (btnPlayIntro && video) {
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
    }

    // ==========================================
    // 2. BASE DE CONOCIMIENTOS (ÁRBOL DE DECISIÓN)
    // ==========================================
    // Árbol inicial estructurado por Tropa de Torre, Hechizo, Estructura y Tropa.
    const defaultTree = {
        "question": "¿Es una tropa de torre (como el Rey o las Princesas)?",
        "yes": {
            "question": "¿Lanza cuchillos?",
            "yes": "Duquesa de dagas",
            "no": "Rey"
        },
        "no": {
            "question": "¿Es un hechizo?",
            "yes": {
                "question": "¿Su efecto principal es congelar o inmovilizar?",
                "yes": "Hielo",
                "no": "Bola de Fuego"
            },
            "no": {
                "question": "¿Es una estructura?",
                "yes": {
                    "question": "¿Tiene la habilidad de esconderse bajo tierra?",
                    "yes": "Torre Tesla",
                    "no": "Cañón"
                },
                "no": {
                    "question": "¿Lanza bolas de fuego?",
                    "yes": {
                        "question": "¿Es humano?",
                        "yes": {
                            "question": "¿Es de calidad especial?",
                            "yes": "Mago",
                            "no": {
                                "question": "¿Lleva un caldero y genera espíritus?",
                                "yes": "Horno",
                                "no": "Cazador" 
                            }
                        },
                        "no": {
                            "question": "¿Es un animal volador?",
                            "yes": "Bebé Dragón",
                            "no": "Espíritu de fuego"
                        }
                    },
                    "no": {
                        "question": "¿Es de calidad Épica?",
                        "yes": {
                            "question": "¿Es mujer e invoca esqueletos?",
                            "yes": "Bruja",
                            "no": "Lanzarrocas"
                        },
                        "no": "Caballero"
                    }
                }
            }
        }
    };

    // Cargamos el árbol modificado si el usuario ya le enseñó cartas nuevas, o usamos el default
    let knowledgeTree = JSON.parse(localStorage.getItem('crExpertSystem')) || defaultTree;
    
    // Memoria de trabajo
    let currentNode = knowledgeTree; 
    let parentNode = null;           
    let lastDirection = null;        

    // ==========================================
    // 3. REFERENCIAS A LA INTERFAZ Y CONTROL DE PANTALLAS
    // ==========================================
    const screenQuestion = document.getElementById("screen-question");
    const screenResult = document.getElementById("screen-result");
    const screenLearn = document.getElementById("screen-learn");
    
    // Obtenemos la referencia a la etiqueta <img> de nuestro HTML
    const guessedCharImage = document.getElementById("guessed-character-image");

    function hideAllScreens() {
        screenStart.style.display = "none";
        screenQuestion.style.display = "none";
        screenResult.style.display = "none";
        screenLearn.style.display = "none";
    }

    // ==========================================
    // 4. MOTOR DE INFERENCIA (ENCADENAMIENTO HACIA ADELANTE)
    // ==========================================
    document.getElementById("btn-start").addEventListener("click", () => {
        currentNode = knowledgeTree; 
        parentNode = null;
        lastDirection = null;
        askNextQuestion();
    });

    function askNextQuestion() {
        hideAllScreens();
        
        if (typeof currentNode === "string") {
            // Llegamos a una hoja del árbol (una conclusión)
            document.getElementById("guessed-character").textContent = currentNode;
            
            // Lógica de Imágenes: Buscar la imagen del personaje adivinado
            if (guessedCharImage) {
                const imageName = characterImages[currentNode];
                if (imageName) {
                    guessedCharImage.src = `img/${imageName}`;
                    guessedCharImage.alt = `Imagen de ${currentNode}`;
                    guessedCharImage.style.display = "block"; // Muestra la imagen
                } else {
                    guessedCharImage.style.display = "none";  // Oculta si no hay imagen
                }
            }

            screenResult.style.display = "block";
        } else {
            // Sigue siendo un nodo con una pregunta
            document.getElementById("question-text").textContent = currentNode.question;
            screenQuestion.style.display = "block";
        }
    }

    document.getElementById("btn-yes").addEventListener("click", () => {
        parentNode = currentNode;
        lastDirection = 'yes';
        currentNode = currentNode.yes; 
        askNextQuestion();
    });

    document.getElementById("btn-no").addEventListener("click", () => {
        parentNode = currentNode;
        lastDirection = 'no';
        currentNode = currentNode.no; 
        askNextQuestion();
    });

    // ==========================================
    // 5. MÓDULO DE APRENDIZAJE
    // ==========================================
    document.getElementById("btn-guess-yes").addEventListener("click", () => {
        alert("¡Excelente! El sistema experto dedujo la carta correctamente.");
        hideAllScreens();
        screenStart.style.display = "block";
    });

    document.getElementById("btn-guess-no").addEventListener("click", () => {
        hideAllScreens();
        screenLearn.style.display = "block";
        
        document.getElementById("new-char-input").value = "";
        document.getElementById("new-question-input").value = "";
        document.getElementById("learn-old-name").textContent = currentNode; 
        document.getElementById("learn-new-name").textContent = "tu carta";
        document.getElementById("learn-new-name-2").textContent = "tu carta";
    });

    document.getElementById("new-char-input").addEventListener("input", (e) => {
        const name = e.target.value || "tu carta";
        document.getElementById("learn-new-name").textContent = name;
        document.getElementById("learn-new-name-2").textContent = name;
    });

    function saveNewKnowledge(isNewCharYes) {
        const newCharName = document.getElementById("new-char-input").value.trim();
        const newQuestion = document.getElementById("new-question-input").value.trim();
        const oldCharName = currentNode; 

        if (!newCharName || !newQuestion) {
            alert("Completa ambos campos para guardar la regla en la base de conocimientos.");
            return;
        }

        const newNode = {
            question: newQuestion,
            yes: isNewCharYes ? newCharName : oldCharName,
            no: isNewCharYes ? oldCharName : newCharName
        };

        if (parentNode === null) {
            knowledgeTree = newNode; 
        } else {
            parentNode[lastDirection] = newNode; 
        }

        // Se guarda en memoria local (para el requisito del 10)
        localStorage.setItem('crExpertSystem', JSON.stringify(knowledgeTree));

        alert("¡Base de conocimientos actualizada!");
        hideAllScreens();
        screenStart.style.display = "block";
    }

    document.getElementById("btn-learn-yes").addEventListener("click", () => saveNewKnowledge(true));
    document.getElementById("btn-learn-no").addEventListener("click", () => saveNewKnowledge(false));

});