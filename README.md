# RP-GPT (The AI Game Master)

**Live out your own text-based adventures, powered by AI.**

RP-GPT is a browser-based application that uses Ollama, Node.js, and React to create a dynamic and interactive text-adventure experience. Craft your own world, define the story, and let the AI guide you through your unique journey.

## How It Works

You are the architect of your adventure. Begin by creating a set of initial **plot points** and **quests**. These elements form the foundation of your world. Once you've set the stage, write your opening prompt and start your adventure!

### What is a Plot Point?

A plot point is any piece of information you want the AI to remember during your game. This can include:

*   **Characters:** Key people your character might encounter.
*   **Locations:** Important places in your world.
*   **Events:** Significant occurrences that shape the story.

You can add **triggers** to each plot point. When a trigger word or phrase appears in the game's context, the AI will be reminded of the relevant plot point, ensuring a consistent and reactive story.

## Features

*   **Dynamic Storytelling:** The AI generates responses based on your prompts and the established plot points.
*   **World Building:** Easily define the core elements of your story.
*   **Save/Load Progress:** Continue your adventure right where you left off.
*   **Customizable AI:** Configure the Ollama settings to tailor the AI's behavior.

## Requirements

*   [Ollama](https://ollama.com/)
*   Node.js and npm
*   A GPU capable of running a 23B parameter model is recommended for local Ollama instances. Alternatively, you can use a cloud-based Ollama service.

## Setup

1.  **Install Ollama:** Follow the instructions on the [Ollama website](https://ollama.com/).
2.  **Install an AI Model:** A recommended model is `mistral-small`, `mistral-nemo`, or `llama3.1`.
    ```bash
    ollama pull mistral-nemo
    ```
3.  **Install Dependencies:** Navigate to the project directory and run:
    ```bash
    npm install
    ```
    Navigate to node directory
    ```bash
    cd node
    ```
    and run
    ```bash
    npm install
    ```
4.  **Start the Application:**
    *   On Windows, run `run.bat`.
    *   On Linux or macOS, run `run.sh`.

    ```bash
    # Alternatively, you can start the frontend and backend separately
    # In the /node directory:
    npm start

    # In the root project directory:
    npm start
    ```

**Note:** You can run Ollama on one machine and the React/Node server on another. Just make sure to configure the correct IP address in the application settings.