export interface AssessmentQuestion {
  text: string;
  alternative_texts?: string[];
}

export interface Assessment {
  title: string;
  description: string;
  instructions: string;
  questions: AssessmentQuestion[];
  scoringFn: (responses: number[]) => ScoringResult;
}

export interface ScoringResult {
  total: number;
  severity: string;
  interpretation: string;
  [key: string]: number | string; // For subscale scores like depression, anxiety, stress
}