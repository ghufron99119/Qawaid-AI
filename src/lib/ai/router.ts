import { orchestrateAnalysis, orchestrateQuiz } from './orchestrator';

export type AnalysisItem = {
  word: string;
  type: string;
  i3rab: string;
  explanation?: string;
};

export type AnalysisResult = AnalysisItem[];

export type QuizQuestion = {
  id?: number;
  question: string;
  options: string[];
  correctAnswer: number; // 0-based index
};

export async function analyzeWithFallback(text: string): Promise<AnalysisResult> {
  const result = await orchestrateAnalysis(text);
  if (Array.isArray(result)) {
    return result as AnalysisResult;
  }
  throw new Error('Orchestrator returned invalid analysis result');
}

export async function generateQuizWithFallback(
  count: number,
  difficulty?: string,
  contextTexts?: string[]
): Promise<QuizQuestion[]> {
  const quiz = await orchestrateQuiz(count, difficulty, contextTexts);
  if (Array.isArray(quiz)) {
    return quiz as QuizQuestion[];
  }
  throw new Error('Orchestrator returned invalid quiz result');
}
