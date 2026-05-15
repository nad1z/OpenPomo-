import { v4 as uuidv4 } from 'uuid';

export type AchievementType =
  | 'streak'
  | 'sessions_count'
  | 'focus_time'
  | 'perfect_day'
  | 'perfect_week'
  | 'early_bird'
  | 'night_owl'
  | 'consistency';

export interface AchievementProps {
  readonly id: string;
  readonly type: AchievementType;
  readonly title: string;
  readonly description: string;
  readonly iconName: string;
  readonly threshold: number;
  readonly earnedAt: Date | null;
  readonly isUnlocked: boolean;
}

export class Achievement {
  readonly id: string;
  readonly type: AchievementType;
  readonly title: string;
  readonly description: string;
  readonly iconName: string;
  readonly threshold: number;
  readonly earnedAt: Date | null;
  readonly isUnlocked: boolean;

  private constructor(props: AchievementProps) {
    this.id = props.id;
    this.type = props.type;
    this.title = props.title;
    this.description = props.description;
    this.iconName = props.iconName;
    this.threshold = props.threshold;
    this.earnedAt = props.earnedAt;
    this.isUnlocked = props.isUnlocked;
  }

  static create(props: Omit<AchievementProps, 'id' | 'earnedAt' | 'isUnlocked'>): Achievement {
    return new Achievement({
      ...props,
      id: uuidv4(),
      earnedAt: null,
      isUnlocked: false,
    });
  }

  static reconstitute(props: AchievementProps): Achievement {
    return new Achievement(props);
  }

  unlock(): Achievement {
    if (this.isUnlocked) return this;
    return Achievement.reconstitute({
      ...this,
      earnedAt: new Date(),
      isUnlocked: true,
    });
  }

  get progressLabel(): string {
    return `${this.threshold} ${this.type.replace('_', ' ')}`;
  }
}
