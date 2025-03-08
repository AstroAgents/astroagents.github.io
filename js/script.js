// AstroAgents Website JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Hero Section Animation Enhancement
    const heroSection = document.querySelector('.hero-section');
    const starsBackground = document.querySelector('.stars-background');
    const meteoritesContainer = document.querySelector('.meteorites-container');
    
    // Sticky Header Implementation
    const header = document.querySelector('header');
    const body = document.body;
    
    function handleStickyHeader() {
        if (heroSection) {
            const heroSectionHeight = heroSection.offsetHeight;
            const scrollPosition = window.scrollY;
            
            if (scrollPosition > heroSectionHeight - 100) {
                header.classList.add('sticky');
                body.classList.add('sticky-header');
            } else {
                header.classList.remove('sticky');
                body.classList.remove('sticky-header');
            }
        }
    }
    
    // Initialize sticky header
    window.addEventListener('scroll', handleStickyHeader);
    
    // Check initial position
    handleStickyHeader();
    
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

    // Main Navigation
    const mainNavBtns = document.querySelectorAll('.main-nav-btn');
    const contentSections = document.querySelectorAll('.content-section');
    const sectionControls = document.querySelectorAll('.section-controls');

    // Function to handle section navigation
    function handleSectionNavigation(btn) {
        // If already active, do nothing
        if (btn.classList.contains('active')) return;

        console.log('Navigation button clicked:', btn.id);

        // Update active state for nav buttons
        mainNavBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Get section ID from data attribute
        const sectionId = btn.getAttribute('data-section');
        console.log('Switching to section:', sectionId);
        
        // Hide all sections and show the selected one
        contentSections.forEach(section => {
            section.classList.remove('active');
            if (section.id === sectionId + '-section') {
                section.classList.add('active');
                console.log('Activated section:', section.id);
            }
        });

        // Update controls in the header
        sectionControls.forEach(control => {
            control.classList.remove('active');
            if (control.id === sectionId + '-controls') {
                control.classList.add('active');
                console.log('Activated controls:', control.id);
            }
        });
    }

    // Initialize section navigation with separate attachments for reliability
    function attachNavigationHandlers() {
        console.log('Attaching navigation handlers to', mainNavBtns.length, 'buttons');
        
        // Directly target each button by ID for reliability
        const workflowBtn = document.getElementById('workflow-nav-btn');
        const hypothesesBtn = document.getElementById('hypotheses-nav-btn');
        
        if (workflowBtn) {
            console.log('Adding click handler to workflow button');
            workflowBtn.addEventListener('click', function() {
                handleSectionNavigation(this);
            });
        }
        
        if (hypothesesBtn) {
            console.log('Adding click handler to hypotheses button');
            hypothesesBtn.addEventListener('click', function() {
                handleSectionNavigation(this);
            });
        }
        
        // Also attach to all buttons with the class as a fallback
        mainNavBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                handleSectionNavigation(this);
            });
        });
    }
    
    // Call this function to ensure the handlers are attached
    attachNavigationHandlers();

    // DOM Elements
    const agentNavBtns = document.querySelectorAll('.agent-nav-btn');
    const agentContents = document.querySelectorAll('.agent-content');
    const prevIterationBtn = document.getElementById('prev-iteration');
    const nextIterationBtn = document.getElementById('next-iteration');
    const iterationDisplay = document.getElementById('iteration-display');
    const modelSelect = document.getElementById('model-select');
    
    // State
    let currentIteration = 1;
    // Use a function to get the max iterations instead of a hardcoded value
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
        // Get the maximum iteration dynamically
        const maxIterations = getMaxIterations();
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
        
        // Get the maximum iteration dynamically
        const maxIterations = getMaxIterations();
        
        // Disable/enable buttons based on current iteration
        prevIterationBtn.disabled = currentIteration === 1;
        nextIterationBtn.disabled = currentIteration >= maxIterations;
        
        // Visual indication of disabled state
        prevIterationBtn.style.opacity = currentIteration === 1 ? '0.5' : '1';
        nextIterationBtn.style.opacity = currentIteration >= maxIterations ? '0.5' : '1';
    }
    
    // Update content based on iteration
    function updateIterationContent() {
        // Update content for all agents
        document.querySelectorAll('.agent-content').forEach(agentContent => {
            const agentId = agentContent.id;
            
            // No need to toggle input content anymore since we have a single input for all iterations
            // Keep this commented out for reference
            /*
            // Toggle visibility of input content based on iteration
            const inputContents = agentContent.querySelectorAll('.input-content');
            inputContents.forEach(content => {
                // Check if this content matches the current iteration
                if (content.classList.contains(`iteration-${currentIteration}`)) {
                    content.style.display = 'block';
                } else {
                    content.style.display = 'none';
                }
            });
            */
            
            // Toggle visibility of output content based on iteration
            const outputContents = agentContent.querySelectorAll('.output-content');
            outputContents.forEach(content => {
                // Check if this content matches the current iteration
                if (content.classList.contains(`iteration-${currentIteration}`)) {
                    content.style.display = 'block';
                } else {
                    content.style.display = 'none';
                }
            });
        });
    }
    
    // Function to load model results (adapt your existing results-loader.js logic)
    function loadModelResults(agentId, model, iteration, container) {
        // This should integrate with your existing results-loader.js functionality
        // Example implementation:
        const filePath = `results_${model}_${model === 'gemini' ? 'flash2' : 'sonnet'}/${agentId.replace('-', '_')}_iteration_${iteration - 1}.txt`;
        
        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(text => {
                // Remove the loading indicator
                const loadingElem = container.querySelector('.loading');
                if (loadingElem) {
                    loadingElem.remove();
                }
                
                // Insert content before the model badge
                const modelBadge = container.querySelector('.model-badge');
                const contentDiv = document.createElement('div');
                contentDiv.className = 'agent-output-content';
                contentDiv.innerHTML = text;
                container.insertBefore(contentDiv, modelBadge);
            })
            .catch(error => {
                container.innerHTML = `<p class="error">Failed to load results: ${error.message}</p><p class="model-badge ${model}">${model === 'gemini' ? 'Gemini 2.0 Flash' : 'Claude 3.5 Sonnet'}</p>`;
            });
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

    // Function to get the maximum iteration number from agentResultsConfig in results-loader.js
    function getMaxIterations() {
        // Default to 2 if agentResultsConfig isn't available yet
        if (typeof window.agentResultsConfig === 'undefined') {
            return 2;
        }
        
        let maxIteration = 1;
        // Loop through all agents in the config
        Object.keys(window.agentResultsConfig).forEach(agentId => {
            // Check claude configuration (could also check gemini)
            if (window.agentResultsConfig[agentId] && window.agentResultsConfig[agentId]['claude']) {
                Object.keys(window.agentResultsConfig[agentId]['claude']).forEach(iteration => {
                    const iterNum = parseInt(iteration);
                    if (iterNum > maxIteration) {
                        maxIteration = iterNum;
                    }
                });
            }
        });
        
        return maxIteration;
    }

    // Hypotheses Section Controls
    const hypothesesModelSelect = document.getElementById('hyp-model-select');
    const rowsPrevBtn = document.getElementById('rows-prev');
    const rowsNextBtn = document.getElementById('rows-next');
    const pageDisplay = document.getElementById('page-display');
    
    // Initialize hypotheses controls
    if (hypothesesModelSelect) {
        console.log('Setting up hypotheses model selector');
        hypothesesModelSelect.addEventListener('change', function() {
            const selectedModel = this.value;
            console.log('Header model selector changed to:', selectedModel);
            
            // Update the table to show the selected model's data
            updateHypothesesTable(selectedModel);
        });
    }
    
    // Pagination for hypotheses table
    if (rowsPrevBtn && rowsNextBtn && pageDisplay) {
        let currentPage = 1;
        const rowsPerPage = 5; // Changed from 10 to 5 rows per page
        
        rowsPrevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                updatePageDisplay();
                updateTablePagination();
            }
        });
        
        rowsNextBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(getTotalHypothesesRows() / rowsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                updatePageDisplay();
                updateTablePagination();
            }
        });
        
        function updatePageDisplay() {
            pageDisplay.textContent = `Page ${currentPage}`;
            
            // Update button states
            rowsPrevBtn.disabled = currentPage === 1;
            const totalPages = Math.ceil(getTotalHypothesesRows() / rowsPerPage);
            rowsNextBtn.disabled = currentPage >= totalPages;
        }
        
        function updateTablePagination() {
            console.log('Updating table pagination, current page:', currentPage);
            
            // Get all available rows (rows for the current selected model)
            const availableRows = document.querySelectorAll('.evaluation-table tbody tr[data-available="true"]');
            console.log('Total available rows:', availableRows.length);
            
            // Hide all rows first
            availableRows.forEach(row => row.style.display = 'none');
            
            // Calculate which rows to display for the current page
            const startIndex = (currentPage - 1) * rowsPerPage;
            const endIndex = Math.min(startIndex + rowsPerPage, availableRows.length);
            console.log(`Showing rows from index ${startIndex} to ${endIndex-1}`);
            
            // Show only the rows for the current page
            for (let i = startIndex; i < endIndex; i++) {
                if (availableRows[i]) {
                    availableRows[i].style.display = 'table-row';
                    console.log('Showing row:', i);
                }
            }
            
            // Update button states
            updatePageDisplay();
        }
        
        function getTotalHypothesesRows() {
            // Get count of rows for the current selected model
            const availableRows = document.querySelectorAll('.evaluation-table tbody tr[data-available="true"]');
            return availableRows.length;
        }
        
        // Initialize pagination
        updatePageDisplay();
        updateTablePagination();
    }
    
    function updateHypothesesTable(model) {
        console.log('Updating hypotheses table for model:', model);
        
        // First, mark all rows of the selected model as available by setting a custom attribute
        const tableRows = document.querySelectorAll('.evaluation-table tbody tr');
        tableRows.forEach(row => {
            // Hide all rows initially
            row.style.display = 'none';
            
            // Mark rows of the selected model as available
            if (row.classList.contains(model)) {
                row.setAttribute('data-available', 'true');
            } else {
                row.setAttribute('data-available', 'false');
            }
        });
        
        // Reset to page 1 when switching models
        if (typeof currentPage !== 'undefined') {
            currentPage = 1;
        }
        
        // Apply pagination
        if (typeof updateTablePagination === 'function') {
            updateTablePagination();
        } else {
            console.error('updateTablePagination function not available');
        }
    }
    
    // Make sure global functions are accessible outside this scope
    window.updateHypothesesTable = updateHypothesesTable;
    
    // Global initialization function
    function initializeUI() {
        console.log('Initializing UI...');
        
        // Initialize workflow section
        updateIterationDisplay();
        updateIterationContent();
        setModelClass();
        
        // Set initial section display (ensure workflow section is shown by default)
        const workflowSection = document.getElementById('workflow-section');
        const hypothesesSection = document.getElementById('hypotheses-section');
        if (workflowSection && hypothesesSection) {
            workflowSection.classList.add('active');
            hypothesesSection.classList.remove('active');
            console.log('Set initial section visibility');
        }
        
        // Set initial controls display
        const workflowControls = document.getElementById('workflow-controls');
        const hypothesesControls = document.getElementById('hypotheses-controls');
        if (workflowControls && hypothesesControls) {
            workflowControls.classList.add('active');
            hypothesesControls.classList.remove('active');
            console.log('Set initial controls visibility');
        }
        
        // Set up the initial model for hypotheses (should be Claude by default)
        const hypothesesModelSelect = document.getElementById('hyp-model-select');
        if (hypothesesModelSelect) {
            // Ensure Claude is selected
            hypothesesModelSelect.value = 'claude';
            // Initialize the table with Claude data
            if (typeof updateHypothesesTable === 'function') {
                updateHypothesesTable('claude');
            }
        }
        
        // Make sure navigation handlers are attached
        attachNavigationHandlers();
        
        console.log('UI initialization complete');
    }
    
    // Initialize everything once the DOM is fully loaded
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        console.log('Document already loaded, initializing immediately');
        setTimeout(() => {
            initializeUI();
            
            // Set default model availability after a small delay to ensure data is loaded
            setTimeout(() => {
                // Mark claude rows as available by default (since it's the default model)
                const claudeRows = document.querySelectorAll('.evaluation-table tbody tr.claude');
                claudeRows.forEach(row => row.setAttribute('data-available', 'true'));
                
                // Mark gemini rows as unavailable
                const geminiRows = document.querySelectorAll('.evaluation-table tbody tr.gemini');
                geminiRows.forEach(row => row.setAttribute('data-available', 'false'));
                
                // Apply initial pagination
                if (typeof updateTablePagination === 'function') {
                    updateTablePagination();
                }
            }, 500);
        }, 0);
    } else {
        console.log('Adding DOMContentLoaded listener');
        window.addEventListener('DOMContentLoaded', initializeUI);
    }
}); 