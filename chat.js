import OpenAI from 'openai';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.XAI_API_KEY,
    baseURL: process.env.BASE_URL,
});

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Initialize conversation history
const messages = [
    {
        role: 'system',
        content: "You are Grok, a chatbot, a helpful assistant that can answer questions about anything.",
    }
];

// Function to get user input and return a promise
const askQuestion = () => {
    return new Promise((resolve) => {
        rl.question('You: ', (input) => {
            resolve(input);
        });
    });
};

// Main chat loop
async function chatLoop() {
    while (true) {
        const userInput = await askQuestion();
        
        // Exit if user enters empty input
        if (!userInput.trim()) {
            console.log('Goodbye!');
            rl.close();
            break;
        }

        // Add user message to conversation
        messages.push({ role: 'user', content: userInput });

        try {
            const completion = await openai.chat.completions.create({
                model: 'grok-beta',
                messages: messages,
            });

            const assistantResponse = completion.choices[0].message;
            console.log('Assistant:', assistantResponse.content);
            
            // Add assistant's response to conversation history
            messages.push(assistantResponse);
        } catch (error) {
            console.error('Error:', error.message);
        }
    }
}

// Start the chat
console.log('Start chatting (press Enter with no input to exit)');
chatLoop();
