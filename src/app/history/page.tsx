"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getExamHistory, SavedExam, clearHistory } from "@/lib/storage";
import { Badge } from "lucide-react"; // Using lucide icons, wait, Badge is usually a component. Let's use simple div styling or check if we have Badge.
// Checking previous files, we don't have Badge component explicitly created, I'll use standard Tailwind.
import { Trash2, PlayCircle, Clock, BookOpen } from "lucide-react";

export default function HistoryPage() {
    const [history, setHistory] = useState<SavedExam[]>([]);

    useEffect(() => {
        setHistory(getExamHistory());
    }, []);

    const handleRetake = (exam: SavedExam) => {
        // Save to currentExam session storage for the Exam Page to pick up
        sessionStorage.setItem('currentExam', JSON.stringify(exam.questions));
        window.location.href = '/exam';
    };

    const handleDeleteHistory = () => {
        if (confirm("Tem certeza que deseja apagar todo o histórico?")) {
            clearHistory();
            setHistory([]);
        }
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Minhas Provas</h1>
                    <p className="text-slate-400">Histórico de simulados gerados e re-utilizáveis.</p>
                </div>
                {history.length > 0 && (
                    <Button variant="destructive" size="sm" onClick={handleDeleteHistory}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Limpar Histórico
                    </Button>
                )}
            </div>

            {history.length === 0 ? (
                <Card className="bg-slate-900 border-slate-800 text-center py-16">
                    <CardContent>
                        <div className="flex justify-center mb-4">
                            <BookOpen className="w-12 h-12 text-slate-700" />
                        </div>
                        <h3 className="text-xl font-medium text-slate-300 mb-2">Nenhuma prova salva ainda</h3>
                        <p className="text-slate-500 mb-6">Gere sua primeira prova com IA para vê-la aqui.</p>
                        <div className="flex justify-center gap-4">
                            <Button onClick={() => window.location.href = '/generator/enem'}>Criar ENEM</Button>
                            <Button onClick={() => window.location.href = '/generator/concurso'} variant="outline">Criar Concurso</Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {history.map((exam) => (
                        <Card key={exam.id} className="bg-slate-900 border-slate-800 hover:border-violet-500/50 transition-colors group">
                            <CardHeader>
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${exam.type === 'ENEM' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                                        }`}>
                                        {exam.type}
                                    </span>
                                    <span className="text-xs text-slate-500 flex items-center">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {new Date(exam.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <CardTitle className="text-white truncate" title={exam.title}>
                                    {exam.title}
                                </CardTitle>
                                <CardDescription className="text-slate-400">
                                    {exam.questions.length} Questões
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-2">
                                    <Button
                                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-white"
                                        onClick={() => {
                                            sessionStorage.setItem('currentExam', JSON.stringify(exam.questions));
                                            sessionStorage.setItem('examMode', 'view');
                                            window.location.href = '/exam';
                                        }}
                                    >
                                        <BookOpen className="w-4 h-4 mr-2" />
                                        Ver
                                    </Button>
                                    <Button
                                        className="flex-1 bg-violet-600 hover:bg-violet-700 text-white"
                                        onClick={() => handleRetake(exam)}
                                    >
                                        <PlayCircle className="w-4 h-4 mr-2" />
                                        Refazer
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
