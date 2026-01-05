import { GoogleGenAI, Chat } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getTipOfTheDay = async (): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: "Provide one concise, actionable tip for a parent of a child with ADHD. The tip should be encouraging and easy to implement today.",
        });
        return response.text ?? "Remember to take a deep breath and celebrate small victories today!";
    } catch (error) {
        console.error("Error fetching tip of the day:", error);
        return "Remember to take a deep breath and celebrate small victories today!";
    }
};

const getEducationalContent = async (ageGroup: string): Promise<{content: string, sources: any[]}> => {
    try {
        const prompt = `Provide foundational information for parents of a child with ADHD in the ${ageGroup} age group. Cover these topics in a clear, easy-to-read format: 1. Understanding ADHD types relevant to this age. 2. Common symptoms and challenges for this age. 3. Basic behavioral strategies parents can use. Use markdown for formatting.`;
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });
        const content = response.text ?? "Could not retrieve content at this time.";
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
        return { content, sources };
    } catch (error) {
        console.error("Error fetching educational content:", error);
        return { content: "An error occurred while fetching content. Please try again.", sources: [] };
    }
};

const findProviders = async (query: string, location: { latitude: number, longitude: number }): Promise<{results: string, sources: any[]}> => {
    try {
        const prompt = `Find ADHD-specialized ${query} near my current location. For each result, provide the following details in this exact format, with each detail on a new line:
**Name:** [Name of provider]
**Address:** [Full address]
**Phone:** [Phone number in international format, e.g., +1-555-123-4567]
**Specialization:** [Brief description of specialization]
---`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleMaps: {} }],
                toolConfig: {
                    retrievalConfig: {
                        latLng: {
                            latitude: location.latitude,
                            longitude: location.longitude
                        }
                    }
                }
            },
        });
        const results = response.text ?? "Could not find any providers matching your search.";
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
        return { results, sources };
    } catch (error) {
        console.error("Error finding providers:", error);
        return { results: "An error occurred while searching for providers. Please check your connection and try again.", sources: [] };
    }
};


const getChatSession = (): Chat => {
    return ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
            systemInstruction: 'You are a helpful and empathetic assistant for parents of children with ADHD. Your name is Spark. Provide supportive, practical, and evidence-informed advice. Do not provide medical diagnoses. Keep your answers concise and easy to understand for a stressed parent. Use emojis to convey warmth and support.'
        }
    });
};


export const geminiService = {
    getTipOfTheDay,
    getEducationalContent,
    findProviders,
    getChatSession
};