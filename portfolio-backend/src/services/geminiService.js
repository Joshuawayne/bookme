// portfolio-backend/src/services/geminiService.js
const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

class GeminiService {
    constructor() {
        this.axiosInstance = axios.create({
            baseURL: GEMINI_API_URL,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GEMINI_API_KEY}`
            }
        });
    }

    async generateResponse(prompt) {
        try {
            const response = await this.axiosInstance.post('', {
                contents: [
                    {
                        parts: [
                            {
                                text: prompt
                            }
                        ]
                    }
                ]
            });

            const generatedContent = response.data.candidates[0].content.parts[0].text;
            return generatedContent;
        } catch (error) {
            console.error('Error generating response from Gemini:', error);
            throw error;
        }
    }
}

module.exports = new GeminiService();