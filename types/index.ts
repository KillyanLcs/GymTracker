export interface ExoResult {
  id: number;
}

export interface SeanceResult {
  nom: string;
  date: string;
}

export interface ExerciceItem {
  id: number;
  nom: string;
}

export interface LogItem {
  id: number;
  poids: number;
  reps: number;
  nom: string;
}
