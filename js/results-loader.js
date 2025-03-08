// Configuration object that maps agent names to their result files
const agentResultsConfig = {
  'data-analyst': {
    claude: {
      1: 'results_claude_sonnet/analysis_iteration_1.txt',
      2: 'results_claude_sonnet/analysis_iteration_2.txt'
    },
    gemini: {
      1: 'results_gemini_flash2/analysis_iteration_1.txt',
      2: 'results_gemini_flash2/analysis_iteration_2.txt'
    }
  },
  'planner': {
    claude: {
      1: 'results_claude_sonnet/planner_iteration_1.txt',
      2: 'results_claude_sonnet/planner_iteration_2.txt'
    },
    gemini: {
      1: 'results_gemini_flash2/planner_iteration_1.txt',
      2: 'results_gemini_flash2/planner_iteration_2.txt'
    }
  },
  'scientist-1': {
    claude: {
      1: 'results_claude_sonnet/scientist1_iteration_1.txt',
      2: 'results_claude_sonnet/scientist1_iteration_2.txt'
    },
    gemini: {
      1: 'results_gemini_flash2/scientist1_iteration_1.txt',
      2: 'results_gemini_flash2/scientist1_iteration_2.txt'
    }
  },
  'scientist-2': {
    claude: {
      1: 'results_claude_sonnet/scientist2_iteration_1.txt',
      2: 'results_claude_sonnet/scientist2_iteration_2.txt'
    },
    gemini: {
      1: 'results_gemini_flash2/scientist2_iteration_1.txt',
      2: 'results_gemini_flash2/scientist2_iteration_2.txt'
    }
  },
  'scientist-3': {
    claude: {
      1: 'results_claude_sonnet/scientist3_iteration_1.txt',
      2: 'results_claude_sonnet/scientist3_iteration_2.txt'
    },
    gemini: {
      1: 'results_gemini_flash2/scientist3_iteration_1.txt',
      2: 'results_gemini_flash2/scientist3_iteration_2.txt'
    }
  },
  'accumulator': {
    claude: {
      1: 'results_claude_sonnet/accumulator_iteration_1.txt',
      2: 'results_claude_sonnet/accumulator_iteration_2.txt'
    },
    gemini: {
      1: 'results_gemini_flash2/accumulator_iteration_1.txt',
      2: 'results_gemini_flash2/accumulator_iteration_2.txt'
    }
  },
  'literature': {
    claude: {
      1: 'results_claude_sonnet/literature_iteration_1.txt',
      2: 'results_claude_sonnet/literature_iteration_2.txt'
    },
    gemini: {
      1: 'results_gemini_flash2/literature_iteration_1.txt',
      2: 'results_gemini_flash2/literature_iteration_2.txt'
    }
  },
  'critic': {
    claude: {
      1: 'results_claude_sonnet/critic_iteration_1.txt',
      2: 'results_claude_sonnet/critic_iteration_2.txt'
    },
    gemini: {
      1: 'results_gemini_flash2/critic_iteration_1.txt',
      2: 'results_gemini_flash2/critic_iteration_2.txt'
    }
  }
};

// Function to load content from a file
async function loadContent(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load ${url}: ${response.status} ${response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    console.error(`Error loading content from ${url}:`, error);
    return `<p class="error">Failed to load content. ${error.message}</p>`;
  }
}

// Function to load and populate all agent content
async function loadAllAgentContent() {
  // Get all agent content divs
  const agentContentDivs = document.querySelectorAll('.agent-content');
  
  // For each agent content div
  for (const agentDiv of agentContentDivs) {
    const agentId = agentDiv.id;
    
    // Check if this agent has configurations
    if (!agentResultsConfig[agentId]) {
      console.warn(`No result configuration found for agent: ${agentId}`);
      continue;
    }
    
    // For each model (claude, gemini)
    for (const model of ['claude', 'gemini']) {
      // For each iteration (1, 2)
      for (const iteration of [1, 2]) {
        // Get the file path from the configuration
        const filePath = agentResultsConfig[agentId][model][iteration];
        if (!filePath) continue;
        
        // Get the output content container for this agent, iteration, and model
        const outputContentContainer = agentDiv.querySelector(`.output-content.iteration-${iteration} .${model}-content`);
        if (!outputContentContainer) {
          console.warn(`No output container found for agent: ${agentId}, iteration: ${iteration}, model: ${model}`);
          continue;
        }
        
        // Load the content and update the container
        const content = await loadContent(filePath);
        
        // Set the innerHTML of the container, preserving the model badge
        const modelBadge = outputContentContainer.querySelector(`.model-badge.${model}`);
        if (modelBadge) {
          outputContentContainer.innerHTML = content + modelBadge.outerHTML;
        } else {
          outputContentContainer.innerHTML = content + `<p class="model-badge ${model}">${model === 'claude' ? 'Claude 3.5 Sonnet' : 'Gemini 2.0 Flash'}</p>`;
        }
      }
    }
  }
}

// Function to initialize the automatic loading
function initResultsLoader() {
  // Load all agent content when the DOM is fully loaded
  document.addEventListener('DOMContentLoaded', loadAllAgentContent);
  
  // Also reload content when model or iteration changes
  document.getElementById('model-select').addEventListener('change', loadAllAgentContent);
  document.getElementById('prev-iteration').addEventListener('click', loadAllAgentContent);
  document.getElementById('next-iteration').addEventListener('click', loadAllAgentContent);
}

// Initialize the results loader
initResultsLoader(); 