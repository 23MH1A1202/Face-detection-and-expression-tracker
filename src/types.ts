export type Emotion = 'neutral' | 'happy' | 'sad' | 'angry' | 'fearful' | 'disgusted' | 'surprised';

export interface EmotionLog {
  id: string;
  timestamp: number;
  emotion: Emotion;
  confidence: number;
  expressions: Record<string, number>;
}
