"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, Trophy } from "lucide-react";

export default function CreateChallengePage() {
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        area: "ENEM",
        difficulty: "Médio",
        questionsCount: 10,
        prize: "", // Optional
        durationDays: "7"
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API delay
        setTimeout(() => {
            const newChallenge = {
                id: Math.random().toString(36).substr(2, 9),
                title: formData.title,
                description: formData.description,
                area: formData.area,
                difficulty: formData.difficulty,
                questionsCount: formData.questionsCount,
                participants: 0,
                timeLeft: `${formData.durationDays} dias`,
                status: "active",
                prize: formData.prize || undefined, // Only save if exists
                top3: []
            };

            // Save to LocalStorage (Mock Backend)
            const stored = localStorage.getItem("custom_challenges");
            const current = stored ? JSON.parse(stored) : [];
            localStorage.setItem("custom_challenges", JSON.stringify([newChallenge, ...current]));

            setSuccess(true);
            setIsLoading(false);

            // Reset form
            setFormData({
                title: "",
                description: "",
                area: "ENEM",
                difficulty: "Médio",
                questionsCount: 10,
                prize: "",
                durationDays: "7"
            });

            // Hide success after 3s
            setTimeout(() => setSuccess(false), 3000);

        }, 1000);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Criar Novo Desafio</h1>
                <p className="text-muted-foreground">Área Administrativa para lançar competições.</p>
            </div>

            {success && (
                <Alert className="border-green-500 bg-green-900/20 text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Sucesso!</AlertTitle>
                    <AlertDescription>O desafio foi criado e já está visível para os alunos.</AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Detalhes do Desafio</CardTitle>
                    <CardDescription>Defina as regras, dificuldade e premiação.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Título do Desafio <span className="text-red-500">*</span></Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="Ex: Maratona de Matemática - Semana 1"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Descrição <span className="text-red-500">*</span></Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Descreva o que será cobrado..."
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="area">Área / Tema <span className="text-red-500">*</span></Label>
                                <Select name="area" onValueChange={(val) => handleSelectChange('area', val)} value={formData.area} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ENEM Geral">ENEM Geral</SelectItem>
                                        <SelectItem value="Matemática">Matemática</SelectItem>
                                        <SelectItem value="Linguagens">Linguagens</SelectItem>
                                        <SelectItem value="Direito Constitucional">Direito Constitucional</SelectItem>
                                        <SelectItem value="Raciocínio Lógico">Raciocínio Lógico</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="difficulty">Dificuldade <span className="text-red-500">*</span></Label>
                                <Select name="difficulty" onValueChange={(val) => handleSelectChange('difficulty', val)} value={formData.difficulty} required>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Fácil">Fácil</SelectItem>
                                        <SelectItem value="Médio">Médio</SelectItem>
                                        <SelectItem value="Difícil">Difícil</SelectItem>
                                        <SelectItem value="Insano">Insano</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="questionsCount">Qtd. Questões <span className="text-red-500">*</span></Label>
                                <Input
                                    id="questionsCount"
                                    name="questionsCount"
                                    type="number"
                                    min="1"
                                    value={formData.questionsCount}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="durationDays">Duração (Dias) <span className="text-red-500">*</span></Label>
                                <Input
                                    id="durationDays"
                                    name="durationDays"
                                    type="number"
                                    min="1"
                                    value={formData.durationDays}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-800">
                            <div className="space-y-2">
                                <Label htmlFor="prize">🏆 Premiação (Opcional)</Label>
                                <Input
                                    id="prize"
                                    name="prize"
                                    placeholder="Ex: R$ 50,00 ou Mentoria Grátis (Deixe vazio se não houver)"
                                    value={formData.prize}
                                    onChange={handleChange}
                                />
                                <p className="text-xs text-muted-foreground">Se deixar em branco, o campo de prêmio não aparecerá no card.</p>
                            </div>
                        </div>

                        <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 mt-4" disabled={isLoading}>
                            {isLoading ? "Criando..." : "Publicar Desafio"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
