# AstroAgents Website

This is an interactive website showcasing the AstroAgents scientific analysis workflow. The website demonstrates a multi-agent scientific analysis pipeline that processes mass spectrometry data from meteorite samples.

## Features

- Interactive agent-based workflow visualization
- Multiple iterations of analysis showing the progressive refinement of hypotheses
- Compare outputs from different AI models (Gemini 2.0 Flash and Claude 3.5 Sonnet)
- Responsive design that works on desktop and mobile devices

## Workflow Overview

The workflow consists of the following agents:

1. **Data Analyst**: Identifies patterns, highlights unexpected findings, and discovers possible contamination in the raw data
2. **Planner**: Delegates specific areas of investigation to three scientists
3. **Scientists (1-3)**: Perform specialized analysis on different aspects of the data
4. **Accumulator**: Combines and refines hypotheses from the scientists
5. **Literature Review**: Provides literature support for the hypotheses
6. **Critic**: Evaluates the hypotheses and suggests improvements

## Usage

1. Navigate between different agents by clicking on the agent icons in the sidebar
2. Switch between iterations using the arrow buttons in the header
3. Select different AI models using the model dropdown to compare their outputs
4. Each agent view shows:
   - The agent's description and role
   - The input data/information for that agent
   - The output produced by the agent (with model-specific variations where applicable)

## Technical Details

This website is built with:
- HTML5
- CSS3 with responsive design principles
- Vanilla JavaScript (no frameworks or libraries required except Font Awesome for icons)

## Getting Started

Simply open the `index.html` file in a web browser to view the website. No server or special setup is required.

## License

This project is provided as a demonstration and can be freely used for educational purposes. 