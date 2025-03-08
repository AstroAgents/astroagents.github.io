// Hypotheses Loader
// This script dynamically loads hypothesis data from CSV files and populates the hypothesis evaluation table

// Make initHypothesisTable accessible globally
window.initHypothesisTable = null;

document.addEventListener('DOMContentLoaded', () => {
    // CSV file paths
    const csvPaths = {
        claude: './hypotheses/hypothesis_list_claude_sonnet_latest.csv',
        gemini: './hypotheses/results_gemini_flash2_latest.csv'
    };

    console.log('Initialized hypotheses-loader with paths:', csvPaths);

    // Function to parse CSV data
    async function parseCSV(csvText) {
        if (!csvText || csvText.trim() === '') {
            console.error('CSV text is empty');
            return {};
        }
        
        const lines = csvText.split('\n');
        if (lines.length <= 1) {
            console.error('CSV has no data rows, only header or empty');
            return {};
        }
        
        // Trim whitespace from headers to handle potential spacing issues
        const headers = lines[0].split(',').map(header => header.trim());
        
        // Debug: Log the headers to see the exact naming
        console.log("CSV Headers:", headers);
        
        // Map to store hypotheses by iteration
        const hypothesesByIteration = {};
        
        // Parse each line
        for (let i = 1; i < lines.length; i++) {
            if (!lines[i] || lines[i].trim() === '') {
                console.log(`Skipping empty line ${i}`);
                continue;
            }
            
            try {
                // Split by comma, but handle values in quotes
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
                
                // Validate that we have the minimum required fields
                if (!hypothesis['Iteration'] || !hypothesis['Hypothesis id'] || !hypothesis['statement']) {
                    console.warn(`Line ${i} is missing required fields, skipping:`, hypothesis);
                    continue;
                }
                
                // Debug: Log processed data for the first few hypotheses
                if (i <= 3) {
                    console.log(`Processed hypothesis ${i}:`, hypothesis);
                }
                
                // Group hypotheses by iteration
                const iteration = hypothesis['Iteration'];
                if (!hypothesesByIteration[iteration]) {
                    hypothesesByIteration[iteration] = [];
                }
                hypothesesByIteration[iteration].push(hypothesis);
            } catch (err) {
                console.error(`Error parsing line ${i}:`, err, lines[i]);
            }
        }
        
        if (Object.keys(hypothesesByIteration).length === 0) {
            console.warn('No hypotheses were parsed from the CSV');
        } else {
            console.log(`Successfully parsed hypotheses for iterations:`, Object.keys(hypothesesByIteration));
        }
        
        return hypothesesByIteration;
    }

    // Function to load CSV data
    async function loadCSVData(filePath) {
        try {
            console.log(`Attempting to load CSV data from: ${filePath}`);
            
            // Use absolute path to ensure correct file location
            const absolutePath = window.location.origin + '/' + filePath;
            console.log(`Using absolute path: ${absolutePath}`);
            
            const response = await fetch(filePath);
            
            if (!response.ok) {
                throw new Error(`Failed to load ${filePath}: ${response.status} ${response.statusText}`);
            }
            
            const csvText = await response.text();
            console.log(`CSV data loaded, length: ${csvText.length} characters`);
            
            // Show a preview of the CSV
            console.log(`CSV preview: ${csvText.substring(0, 100)}...`);
            
            // Parse the CSV data
            const parsedData = await parseCSV(csvText);
            
            // Log how many hypotheses were found
            let totalHypotheses = 0;
            Object.keys(parsedData).forEach(iteration => {
                totalHypotheses += parsedData[iteration].length;
            });
            console.log(`Parsed ${totalHypotheses} hypotheses across ${Object.keys(parsedData).length} iterations`);
            
            return parsedData;
        } catch (error) {
            console.error('Error loading CSV data:', error);
            
            // Fallback - try using test data
            console.log('Using fallback test data');
            
            // Create some test hypotheses data for demonstration
            const testData = {
                "1": [
                    {
                        "Iteration": "1",
                        "Hypothesis id": "H_test_1",
                        "statement": "This is a test hypothesis for debugging purposes.",
                        "comments": "Test comment",
                        "key_datapoints": "Test data points",
                        "Novelty": "5",
                        "Consistency with Existing Knowledge": "5",
                        "Clarity & Precision": "5",
                        "Empirical Support from the data": "5",
                        "Scope and Generalizability": "5",
                        "Predictive Power": "5"
                    },
                    {
                        "Iteration": "1",
                        "Hypothesis id": "H_test_2",
                        "statement": "This is a second test hypothesis.",
                        "comments": "Another test comment",
                        "key_datapoints": "More test data points",
                        "Novelty": "7",
                        "Consistency with Existing Knowledge": "7",
                        "Clarity & Precision": "7",
                        "Empirical Support from the data": "7",
                        "Scope and Generalizability": "7",
                        "Predictive Power": "7"
                    }
                ]
            };
            
            return testData;
        }
    }

    // Populate the hypothesis table with data
    function populateHypothesisTable(hypothesesData, model) {
        console.log(`Populating hypothesis table with ${model} data:`, hypothesesData);
        
        // Get the table body
        const tableBody = document.querySelector('.evaluation-table tbody');
        
        if (!tableBody) {
            console.error('Hypothesis evaluation table not found');
            return;
        }
        
        // Check if we have data to display
        if (!hypothesesData || Object.keys(hypothesesData).length === 0) {
            console.warn(`No data available for model: ${model}`);
            tableBody.innerHTML = `<tr class="model-specific ${model}"><td colspan="6">No data available for ${model}. Please check the CSV file.</td></tr>`;
            
            // Mark the row as available for pagination
            const row = tableBody.querySelector(`.model-specific.${model}`);
            if (row) {
                row.setAttribute('data-available', 'true');
                row.style.display = 'table-row';
            }
            
            return;
        }
        
        // Clear existing rows of the same model
        const existingModelRows = tableBody.querySelectorAll(`.model-specific.${model}`);
        existingModelRows.forEach(row => tableBody.removeChild(row));
        
        // Get all iterations and sort them numerically
        const iterations = Object.keys(hypothesesData).sort((a, b) => parseInt(a) - parseInt(b));
        console.log(`Found iterations: ${iterations.join(', ')}`);
        
        let rowsCreated = 0;
        
        // For each iteration, add the hypotheses to the table
        for (const iteration of iterations) {
            const hypotheses = hypothesesData[iteration];
            console.log(`Processing iteration ${iteration} with ${hypotheses.length} hypotheses`);
            
            for (const hypothesis of hypotheses) {
                try {
                    const row = document.createElement('tr');
                    row.classList.add('model-specific', model);
                    rowsCreated++;
                    
                    // Create cells for each column
                    row.innerHTML = `
                        <td>${hypothesis.Iteration || ''}</td>
                        <td>${hypothesis['Hypothesis id'] || ''}</td>
                        <td>${hypothesis.statement || ''}</td>
                        <td>${hypothesis.comments || ''}</td>
                        <td>${hypothesis.key_datapoints || ''}</td>
                        <td class="score-metrics">
                            ${createScoreRow('Novelty', hypothesis.Novelty || '0')}
                            ${createScoreRow('Consistency', hypothesis['Consistency with Existing Knowledge'] || '0')}
                            ${createScoreRow('Clarity', hypothesis['Clarity & Precision'] || '0')}
                            ${createScoreRow('Empirical Support', hypothesis['Empirical Support from the data'] || '0')}
                            ${createScoreRow('Generalizability', hypothesis['Scope and Generalizability'] || '0')}
                            ${createScoreRow('Predictive Power', getPredictivePowerValue(hypothesis) || '0')}
                        </td>
                    `;
                    
                    // Helper function to create a score row with label and progress bar
                    function createScoreRow(label, scoreValue) {
                        // Ensure we have valid input
                        if (scoreValue === undefined || scoreValue === null) {
                            console.log(`Missing score value for ${label}, using default`);
                            scoreValue = '0';
                        }
                        
                        // Convert to number and handle non-numeric values
                        const score = parseInt(scoreValue);
                        if (isNaN(score)) {
                            console.log(`Non-numeric score for ${label}: "${scoreValue}"`);
                            return `<div class="score-row">
                                <span class="score-label">${label}:</span>
                                <span>N/A</span>
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
                        
                        // Create the score row with label, bar, and value
                        return `<div class="score-row">
                            <span class="score-label">${label}:</span>
                            <div class="score-bar-container">
                                <div class="score-bar ${colorClass}" style="width: ${percentage}%"></div>
                            </div>
                            <span class="score-value ${colorClass}">${score}</span>
                        </div>`;
                    }
                    
                    // Helper function to get the Predictive Power value
                    function getPredictivePowerValue(hypothesis) {
                        if (!hypothesis) {
                            console.warn('Received undefined hypothesis in getPredictivePowerValue');
                            return '0';
                        }
                        
                        // Try different possible column names for Predictive Power
                        const possibleNames = [
                            'Predictive Power',
                            'PredictivePower',
                            'Predictive_Power',
                            'Predictive-Power'
                        ];
                        
                        // First try exact matches
                        for (const name of possibleNames) {
                            if (hypothesis[name] !== undefined && hypothesis[name] !== null && hypothesis[name] !== '') {
                                return hypothesis[name];
                            }
                        }
                        
                        // Then try case-insensitive matches
                        const hypothesisKeys = Object.keys(hypothesis);
                        for (const name of possibleNames) {
                            const lowerName = name.toLowerCase();
                            for (const key of hypothesisKeys) {
                                if (key.toLowerCase() === lowerName && hypothesis[key] !== undefined && hypothesis[key] !== null && hypothesis[key] !== '') {
                                    return hypothesis[key];
                                }
                            }
                        }
                        
                        // If nothing found, look for any key containing 'predictive' and 'power'
                        for (const key of hypothesisKeys) {
                            const lowerKey = key.toLowerCase();
                            if (lowerKey.includes('predictive') && lowerKey.includes('power') && 
                                hypothesis[key] !== undefined && hypothesis[key] !== null && hypothesis[key] !== '') {
                                return hypothesis[key];
                            }
                        }
                        
                        // Default value if not found
                        return '0';
                    }
                    
                    // Add the row to the table
                    tableBody.appendChild(row);
                    
                } catch (err) {
                    console.error(`Error creating row for hypothesis in iteration ${iteration}:`, err, hypothesis);
                }
            }
        }
        
        console.log(`Created ${rowsCreated} rows for model ${model}`);
        
        // After all rows are added, mark the ones for current model as available
        document.querySelectorAll(`.evaluation-table tbody tr.model-specific.${model}`).forEach(row => {
            row.setAttribute('data-available', 'true');
        });
        
        // Make sure pagination is applied
        if (typeof window.showCurrentHypothesesPage === 'function') {
            window.showCurrentHypothesesPage();
        }
    }
    
    // Define and expose the initialization function globally
    async function initHypothesisTable() {
        try {
            console.log('Initializing hypothesis table...');
            
            // Load data for both models
            console.log('Loading CSV data...');
            const claudeData = await loadCSVData(csvPaths.claude);
            const geminiData = await loadCSVData(csvPaths.gemini);
            
            // Store the data globally for model switching
            window.hypothesesData = {
                claude: claudeData,
                gemini: geminiData
            };
            
            console.log('Data loaded successfully');
            
            // Populate the table with Claude data initially (assuming Claude is the default)
            populateHypothesisTable(claudeData, 'claude');
            
            // Connect the model selector in the header
            const modelSelect = document.getElementById('hyp-model-select');
            if (modelSelect) {
                console.log('Setting up model selector change event');
                modelSelect.addEventListener('change', function() {
                    const selectedModel = this.value;
                    console.log('Model selected in hypotheses-loader:', selectedModel);
                    
                    // Get the data for the selected model
                    const modelData = window.hypothesesData[selectedModel];
                    
                    // Populate the table with the selected model data
                    if (modelData) {
                        populateHypothesisTable(modelData, selectedModel);
                    } else {
                        console.error(`No data found for model: ${selectedModel}`);
                    }
                });
            } else {
                console.warn('Model selector not found in DOM');
            }
            
            // Trigger an update of the pagination after data is loaded
            if (typeof window.showCurrentHypothesesPage === 'function') {
                setTimeout(() => {
                    window.showCurrentHypothesesPage();
                }, 100);
            }
            
            // Alert on success for debugging
            console.log('Hypothesis table initialized successfully with rows:', 
                         document.querySelectorAll('.evaluation-table tbody tr').length);
            
            return true;
        } catch (error) {
            console.error('Error initializing hypothesis table:', error);
            
            // Add more detailed error information to help debugging
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                csvPaths: csvPaths
            });
            
            // Add fallback error handling - try to render something useful
            const tableBody = document.querySelector('.evaluation-table tbody');
            if (tableBody) {
                tableBody.innerHTML = `<tr data-available="true" style="display:table-row"><td colspan="6">Error loading data: ${error.message}</td></tr>`;
            }
            
            return false;
        }
    }
    
    // Expose the function globally
    window.initHypothesisTable = initHypothesisTable;
    
    // Initialize on DOM load - use a more robust approach
    console.log('DOM Content Loaded - Initializing hypothesis table');
    // Wait a short time to ensure everything is loaded
    setTimeout(function() {
        try {
            initHypothesisTable();
        } catch (error) {
            console.error('Error during initialization:', error);
        }
    }, 500);
}); 