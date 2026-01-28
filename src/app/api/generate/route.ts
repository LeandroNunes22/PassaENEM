import { NextResponse } from "next/server";
import { PROMPTS } from "@/lib/prompts";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { type, ...params } = body;

        // 1. Construct the Prompt
        let finalPrompt = PROMPTS.SYSTEM_BASE
            .replace('{tipo_prova}', type)
            .replace('{tipo_prova}', type)
            .replace('{area}', params.area || "Geral")
            .replace('{area}', params.area || "Geral")
            .replace('{tema}', params.tema || params.disciplina || "Geral")
            .replace('{tema}', params.tema || params.disciplina || "Geral")
            .replace('{nivel}', params.nivel || "Médio")
            .replace('{nivel}', params.nivel || "Médio")
            .replace('{quantidade}', params.quantidade || 5)
            .replace('{quantidade}', params.quantidade || 5)
            .replace('{tempo}', params.tempo || 15)
            .replace('{tempo}', params.tempo || 15);

        if (type === 'CONCURSO') {
            finalPrompt += `\n\nContexto Adicional: Banca ${params.banca || "Genérica"}.`;
        }

        // 2. Call Google Gemini API (Direct)
        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            console.error("API Key is MISSING in environment variables");
            throw new Error("API Key missing");
        }

        const modelName = "gemini-2.5-flash";
        console.log(`Using Model: ${modelName}`);
        console.log(`API Key (First 5 chars): ${apiKey.substring(0, 5)}...`);

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: finalPrompt + `\n\nUser Request: Gere ${params.quantidade} questões sobre ${params.tema || params.disciplina}.` }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    response_mime_type: "application/json"
                }
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error("Gemini API Error Response:", errText);

            if (response.status === 429) {
                throw new Error("Limite de uso gratuito atingido. Aguarde cerca de 30 segundos e tente novamente.");
            }

            throw new Error(`Gemini API Error: ${response.status} - ${errText}`);
        }

        const data = await response.json();
        // Extract text from Gemini structure: candidates[0].content.parts[0].text
        const aiContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!aiContent) {
            console.error("Gemini response missing content", data);
            throw new Error("No content received from Gemini");
        }

        // 3. Parse and Adapt JSON
        let parsedData;
        try {
            parsedData = JSON.parse(aiContent);
        } catch (e) {
            console.error("JSON Parse Error:", aiContent);
            throw new Error("Failed to parse AI response.");
        }

        // Adapt strict JSON schema to our Frontend interface
        const adaptedQuestions = parsedData.questoes.map((q: any) => {
            const optionKeys = ["A", "B", "C", "D", "E"];
            const optionsArray = optionKeys.map(key => q.alternativas[key]);
            const correctIndex = optionKeys.indexOf(q.alternativa_correta);

            return {
                id: q.id || Math.random().toString(36).substr(2, 9),
                type: type,
                question: q.enunciado,
                options: optionsArray,
                correctAnswer: correctIndex, // Index (0-4)
                explanation: q.explicacao,
                difficulty: q.dificuldade,
                topic: params.tema || params.disciplina,
                context: q.contexto || undefined
            };
        });

        return NextResponse.json({ success: true, data: adaptedQuestions });

    } catch (error: any) {
        console.error("Generate Route Error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Failed to generate questions" },
            { status: 500 }
        );
    }
}
