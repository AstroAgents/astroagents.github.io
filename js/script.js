// AstroAgents Website JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Hero Section Animation Enhancement
    const heroSection = document.querySelector('.hero-section');
    const starsBackground = document.querySelector('.stars-background');
    const meteoritesContainer = document.querySelector('.meteorites-container');
    
    // Create additional star layers for parallax effect
    if (heroSection && starsBackground) {
        // Create medium stars
        const mediumStars = document.createElement('div');
        mediumStars.classList.add('stars-layer', 'medium-stars');
        heroSection.insertBefore(mediumStars, starsBackground.nextSibling);
        
        // Create large stars
        const largeStars = document.createElement('div');
        largeStars.classList.add('stars-layer', 'large-stars');
        heroSection.insertBefore(largeStars, mediumStars.nextSibling);
        
        // Dynamic meteorite creation
        if (meteoritesContainer) {
            // Reset animation on random intervals for continuous effect
            const meteorites = document.querySelectorAll('.meteorite');
            
            meteorites.forEach(meteorite => {
                // Reset animation at random intervals
                setInterval(() => {
                    meteorite.style.animation = 'none';
                    setTimeout(() => {
                        // Get the original animation from the class name
                        const meteoriteClass = Array.from(meteorite.classList)
                            .find(className => className.startsWith('meteorite-'));
                        
                        if (meteoriteClass) {
                            const animationName = `meteorite-${meteoriteClass.split('-')[1]}`;
                            const duration = 12 + Math.random() * 15; // Random duration between 12-27s
                            
                            meteorite.style.animation = `${animationName} ${duration}s linear forwards`;
                        }
                    }, 50);
                }, 10000 + Math.random() * 20000); // Random interval between 10-30s
            });
            
            // Add occasional new meteorites
            setInterval(() => {
                if (Math.random() > 0.5 && meteoritesContainer.childElementCount < 12) {
                    const meteorType = Math.random() > 0.5 ? 'meteorite-svgrepo-com.svg' : 'meteorites-svgrepo-com.svg';
                    const newMeteorite = document.createElement('div');
                    newMeteorite.classList.add('meteorite', `meteorite-${meteoritesContainer.childElementCount + 1}`);
                    
                    const img = document.createElement('img');
                    img.src = `images/${meteorType}`;
                    img.alt = 'Meteorite';
                    
                    newMeteorite.appendChild(img);
                    
                    // Set random position and size
                    newMeteorite.style.top = `-${50 + Math.random() * 50}px`;
                    newMeteorite.style.left = `${Math.random() * 90}%`;
                    newMeteorite.style.width = `${40 + Math.random() * 60}px`;
                    newMeteorite.style.height = `${40 + Math.random() * 60}px`;
                    
                    // Set random animation
                    const duration = 12 + Math.random() * 15;
                    const animIndex = Math.floor(Math.random() * 5) + 1;
                    newMeteorite.style.animation = `meteorite-${animIndex} ${duration}s linear forwards`;
                    
                    meteoritesContainer.appendChild(newMeteorite);
                    
                    // Remove after animation completes
                    setTimeout(() => {
                        if (meteoritesContainer.contains(newMeteorite)) {
                            meteoritesContainer.removeChild(newMeteorite);
                        }
                    }, duration * 1000);
                }
            }, 8000);
        }
        
        // Parallax effect on scroll
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY < heroSection.offsetHeight) {
                const opacity = 1 - (scrollY / heroSection.offsetHeight);
                heroSection.style.opacity = opacity;
                
                // Parallax effect
                starsBackground.style.transform = `translateY(${scrollY * 0.3}px)`;
                mediumStars.style.transform = `translateY(${scrollY * 0.2}px)`;
                largeStars.style.transform = `translateY(${scrollY * 0.1}px)`;
                
                // Move meteorites faster on scroll
                if (meteoritesContainer) {
                    meteoritesContainer.style.transform = `translateY(${scrollY * 0.5}px)`;
                }
            }
        });
    }
    
    // Smooth scroll for the "Explore the workflow" link
    const scrollDownLink = document.querySelector('.scroll-down');
    if (scrollDownLink) {
        scrollDownLink.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = scrollDownLink.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }

    // DOM Elements
    const agentNavBtns = document.querySelectorAll('.agent-nav-btn');
    const agentContents = document.querySelectorAll('.agent-content');
    const prevIterationBtn = document.getElementById('prev-iteration');
    const nextIterationBtn = document.getElementById('next-iteration');
    const iterationDisplay = document.getElementById('iteration-display');
    const modelSelect = document.getElementById('model-select');
    
    // State
    let currentIteration = 1;
    const maxIterations = 2; // Set the maximum number of iterations
    let currentModel = 'gemini'; // Default model
    
    // Initialize
    updateIterationDisplay();
    updateIterationContent();
    setModelClass();
    
    // Agent Navigation
    agentNavBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // If the button is already active, do nothing
            if (btn.classList.contains('active')) return;
            
            // Remove active class from all buttons
            agentNavBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Get the agent ID from the button's data attribute
            const agentId = btn.getAttribute('data-agent');
            
            // Transition out current content
            agentContents.forEach(content => {
                if (content.classList.contains('active')) {
                    content.style.opacity = '0';
                    
                    // After fade out, hide old content and show new
                    setTimeout(() => {
                        agentContents.forEach(c => c.classList.remove('active'));
                        document.getElementById(agentId).classList.add('active');
                        
                        // Fade in new content
                        setTimeout(() => {
                            document.getElementById(agentId).style.opacity = '1';
                        }, 50);
                    }, 300);
                }
            });
        });
    });
    
    // Iteration Navigation
    prevIterationBtn.addEventListener('click', () => {
        if (currentIteration > 1) {
            currentIteration--;
            updateIterationDisplay();
            updateIterationContent();
        }
    });
    
    nextIterationBtn.addEventListener('click', () => {
        if (currentIteration < maxIterations) {
            currentIteration++;
            updateIterationDisplay();
            updateIterationContent();
        }
    });
    
    // Model Selection
    modelSelect.addEventListener('change', function() {
        currentModel = this.value;
        setModelClass();
    });
    
    // Update iteration display
    function updateIterationDisplay() {
        iterationDisplay.textContent = `Iteration ${currentIteration}`;
        
        // Disable/enable buttons based on current iteration
        prevIterationBtn.disabled = currentIteration === 1;
        nextIterationBtn.disabled = currentIteration === maxIterations;
        
        // Visual indication of disabled state
        prevIterationBtn.style.opacity = currentIteration === 1 ? '0.5' : '1';
        nextIterationBtn.style.opacity = currentIteration === maxIterations ? '0.5' : '1';
    }
    
    // Update content based on iteration
    function updateIterationContent() {
        // Get all iteration content elements
        const iterationContents = document.querySelectorAll('.input-content, .output-content');
        
        // First hide all by setting opacity to 0
        iterationContents.forEach(content => {
            content.style.opacity = '0';
        });
        
        // After fade out completes, update display property
        setTimeout(() => {
            iterationContents.forEach(content => {
                if (content.classList.contains(`iteration-${currentIteration}`)) {
                    content.style.display = 'block';
                    // Trigger reflow
                    void content.offsetWidth;
                    // Fade in
                    content.style.opacity = '1';
                } else {
                    content.style.display = 'none';
                }
            });
        }, 300);
    }
    
    // Set model class on body
    function setModelClass() {
        document.body.classList.remove('model-gemini', 'model-claude');
        document.body.classList.add(`model-${currentModel}`);
        
        // Update UI to show the active model
        const header = document.querySelector('header');
        header.style.borderBottom = `3px solid ${currentModel === 'gemini' ? 'var(--gemini-color)' : 'var(--claude-color)'}`;
        
        // Smoothly transition the model-specific content
        const modelContents = document.querySelectorAll('.gemini-content, .claude-content');
        modelContents.forEach(content => {
            content.style.opacity = '0';
        });
        
        setTimeout(() => {
            // Show the content for the current model
            document.querySelectorAll(`.${currentModel}-content`).forEach(content => {
                content.style.opacity = '1';
            });
        }, 300);
    }
    
    // Add visual feedback for buttons
    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.add('clicked');
            setTimeout(() => {
                this.classList.remove('clicked');
            }, 200);
        });
    });
}); 