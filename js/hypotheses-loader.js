// Hypotheses Loader
// This script dynamically loads hypothesis data from CSV files and populates the hypothesis evaluation table

document.addEventListener('DOMContentLoaded', () => {
    // CSV file paths
    const csvPaths = {
        claude: 'hypotheses/hypothesis_list_claude_sonnet_latest.csv',
        gemini: 'hypotheses/results_gemini_flash2_latest.csv'
    };

    // Function to parse CSV data
    async function parseCSV(csvText) {
        const lines = csvText.split('\n');
        // Trim whitespace from headers to handle potential spacing issues
        const headers = lines[0].split(',').map(header => header.trim());
        
        // Debug: Log the headers to see the exact naming
        console.log("CSV Headers:", headers);
        
        // Map to store hypotheses by iteration
        const hypothesesByIteration = {};
        
        // Process each line (skip headers)
        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue; // Skip empty lines
            
            // Split the line by comma, but preserve commas inside quotes
            const values = [];
            let current = '';
            let insideQuotes = false;
            
            for (let char of lines[i]) {
                if (char === '"') {
                    insideQuotes = !insideQuotes;
                } else if (char === ',' && !insideQuotes) {
                    values.push(current);
                    current = '';
                } else {
                    current += char;
                }
            }
            values.push(current); // Add the last value
            
            // Create an object with the headers as keys
            const hypothesis = {};
            for (let j = 0; j < headers.length; j++) {
                // Remove quotes from values if present
                let value = values[j] || '';
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.substring(1, value.length - 1);
                }
                hypothesis[headers[j]] = value;
            }
            
            // Debug: Log the first hypothesis to see its structure
            if (i === 1) {
                console.log("Sample hypothesis object:", hypothesis);
                console.log("Predictive Power value:", hypothesis['Predictive Power']);
            }
            
            // Group hypotheses by iteration
            const iteration = hypothesis['Iteration'];
            if (!hypothesesByIteration[iteration]) {
                hypothesesByIteration[iteration] = [];
            }
            hypothesesByIteration[iteration].push(hypothesis);
        }
        
        return hypothesesByIteration;
    }

    // Function to load CSV data
    async function loadCSVData(filePath) {
        try {
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`Failed to load ${filePath}: ${response.status} ${response.statusText}`);
            }
            const csvText = await response.text();
            return parseCSV(csvText);
        } catch (error) {
            console.error('Error loading CSV data:', error);
            return {};
        }
    }

    // Function to populate the table with hypothesis data
    function populateHypothesisTable(hypothesesData, model) {
        const tableBody = document.querySelector('.evaluation-table tbody');
        if (!tableBody) {
            console.error('Hypothesis evaluation table not found');
            return;
        }
        
        // Clear the table body first
        tableBody.innerHTML = '';
        
        // Get all iterations and sort them numerically
        const iterations = Object.keys(hypothesesData).sort((a, b) => parseInt(a) - parseInt(b));
        
        // For each iteration, add the hypotheses to the table
        for (const iteration of iterations) {
            const hypotheses = hypothesesData[iteration];
            
            for (const hypothesis of hypotheses) {
                const row = document.createElement('tr');
                row.classList.add('model-specific', model);
                
                // Create cells for each column
                row.innerHTML = `
                    <td>${hypothesis.Iteration}</td>
                    <td>${hypothesis['Hypothesis id']}</td>
                    <td>${hypothesis.statement}</td>
                    <td>${hypothesis.comments || ''}</td>
                    <td>${hypothesis.key_datapoints}</td>
                    <td class="score-metrics">
                        ${createScoreRow('Novelty', hypothesis.Novelty)}
                        ${createScoreRow('Consistency', hypothesis['Consistency with Existing Knowledge'])}
                        ${createScoreRow('Clarity', hypothesis['Clarity & Precision'])}
                        ${createScoreRow('Empirical Support', hypothesis['Empirical Support from the data'])}
                        ${createScoreRow('Generalizability', hypothesis['Scope and Generalizability'])}
                        ${createScoreRow('Predictive Power', getPredictivePowerValue(hypothesis))}
                    </td>
                `;
                
                // Helper function to create a score row with label and progress bar
                function createScoreRow(label, scoreValue) {
                    // Convert to number and handle non-numeric values
                    const score = parseInt(scoreValue);
                    if (isNaN(score)) {
                        return `<div class="score-row">
                            <span class="score-label">${label}:</span>
                            <span>${scoreValue}</span>
                        </div>`;
                    }
                    
                    // Calculate percentage (assuming scores are 0-10)
                    const percentage = Math.min(Math.max((score / 10) * 100, 0), 100); // Ensure between 0-100%
                    
                    // Determine color class based on score
                    let colorClass = 'score-low';
                    if (score >= 8) {
                        colorClass = 'score-excellent';
                    } else if (score >= 6) {
                        colorClass = 'score-good';
                    } else if (score >= 4) {
                        colorClass = 'score-average';
                    }
                    
                    // Create the score row with label and progress bar
                    return `
                    <div class="score-row">
                        <span class="score-label">${label}:</span>
                        <div class="score-bar-container">
                            <div class="score-bar ${colorClass}" style="width: ${percentage}%;"></div>
                            <span class="score-value">${score}/10</span>
                        </div>
                    </div>
                    `;
                }
                
                // Helper function to get the Predictive Power value
                function getPredictivePowerValue(hypothesis) {
                    // Try different possible column names for Predictive Power
                    const possibleNames = [
                        'Predictive Power',
                        'PredictivePower',
                        'Predictive_Power',
                        'Predictive-Power'
                    ];
                    
                    // First try exact matches
                    for (const name of possibleNames) {
                        if (hypothesis[name] !== undefined) {
                            return hypothesis[name];
                        }
                    }
                    
                    // If not found, try case-insensitive search and with whitespace variations
                    const hypKeys = Object.keys(hypothesis);
                    for (const key of hypKeys) {
                        if (key.toLowerCase().replace(/[\s_-]/g, '').includes('predictivepower')) {
                            return hypothesis[key];
                        }
                    }
                    
                    // Special handling for column index-based access if needed
                    // This assumes Predictive Power is the last column (adjust index as needed)
                    if (hypKeys.length > 0) {
                        const lastKey = hypKeys[hypKeys.length - 1];
                        return hypothesis[lastKey];
                    }
                    
                    // If still not found, log the hypothesis object to help debug
                    console.log("Hypothesis object with missing Predictive Power:", hypothesis);
                    return 'N/A';
                }
                
                tableBody.appendChild(row);
            }
        }
        
        // Show the current active model
        showActiveModel();
    }
    
    // Function to show only the active model's hypotheses
    function showActiveModel() {
        const activeModel = document.querySelector('.model-btn.active').dataset.model;
        
        // Hide all rows first
        document.querySelectorAll('.model-specific').forEach(row => {
            row.style.display = 'none';
        });
        
        // Show only rows for the active model
        document.querySelectorAll(`.model-specific.${activeModel}`).forEach(row => {
            row.style.display = 'table-row';
        });
    }
    
    // Initialize the hypothesis table
    async function initHypothesisTable() {
        try {
            // Load data for both models
            const claudeData = await loadCSVData(csvPaths.claude);
            const geminiData = await loadCSVData(csvPaths.gemini);
            
            // Store the data globally for model switching
            window.hypothesesData = {
                claude: claudeData,
                gemini: geminiData
            };
            
            // Populate the table with Claude data initially (assuming Claude is the default)
            populateHypothesisTable(claudeData, 'claude');
            
            // Add event listeners to model toggle buttons
            document.querySelectorAll('.model-btn').forEach(button => {
                button.addEventListener('click', function() {
                    // Update active button
                    document.querySelectorAll('.model-btn').forEach(btn => {
                        btn.classList.remove('active');
                    });
                    this.classList.add('active');
                    
                    // Update table with selected model's data
                    const model = this.dataset.model;
                    populateHypothesisTable(window.hypothesesData[model], model);
                });
            });
        } catch (error) {
            console.error('Error initializing hypothesis table:', error);
        }
    }
    
    // Start the initialization
    initHypothesisTable();
}); 