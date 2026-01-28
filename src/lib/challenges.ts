export interface Challenge {
    id: string;
    title: string;
    description: string;
    area: string;
    difficulty: "Fácil" | "Médio" | "Difícil" | "Insano";
    questionsCount: number;
    participants: number;
    timeLeft: string; // e.g. "2d 10h"
    status: "active" | "finished";
    prize: string; // e.g. "R$ 100,00"
    top3: { name: string; score: number; time: string }[]; // Mock leaderboard
}

export const activeChallenges: Challenge[] = [
    {
        id: "c1",
        title: "Maratona ENEM: Funções e Logaritmos",
        description: "Desafio focado em matemática avançada. Apenas para os fortes.",
        area: "Matemática",
        difficulty: "Difícil",
        questionsCount: 20,
        participants: 142,
        timeLeft: "02 dias 04h",
        status: "active",
        prize: "R$ 50,00 (Pix)",
        top3: [
            { name: "Carlos M.", score: 950, time: "18m 20s" },
            { name: "Ana P.", score: 920, time: "22m 10s" },
            { name: "João S.", score: 880, time: "25m 00s" }
        ]
    },
    {
        id: "c2",
        title: "Desafio Redação Nota 1000",
        description: "Questões teóricas sobre estrutura da redação dissertativa.",
        area: "Redação",
        difficulty: "Médio",
        questionsCount: 15,
        participants: 89,
        timeLeft: "05 dias 10h",
        status: "active",
        prize: "Mentoria de 1h",
        top3: [
            { name: "Fernanda L.", score: 1000, time: "10m 00s" },
            { name: "Pedro H.", score: 980, time: "12m 30s" },
            { name: "Lucas A.", score: 950, time: "11m 45s" }
        ]
    }
];

export const finishedChallenges: Challenge[] = [
    {
        id: "c3",
        title: "Semana Histórica: Era Vargas",
        description: "Teste seus conhecimentos sobre o período mais importante do Brasil.",
        area: "História",
        difficulty: "Médio",
        questionsCount: 10,
        participants: 356,
        timeLeft: "Encerrado",
        status: "finished",
        prize: "R$ 30,00 (Pix)",
        top3: [
            { name: "Você", score: 850, time: "15m 00s" }, // Simulator user participation
            { name: "Maria G.", score: 1000, time: "08m 15s" },
            { name: "Roberto F.", score: 900, time: "09m 30s" }
        ]
    }
];

export const userPerformance = [
    {
        challengeId: "c3",
        title: "Semana Histórica: Era Vargas",
        score: 85, // Percentage
        position: 42,
        totalParticipants: 356,
        time: "15m 00s",
        date: "2024-01-20"
    }
];
