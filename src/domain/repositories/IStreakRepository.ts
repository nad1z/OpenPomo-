import { Streak } from '../valueObjects/Streak';

export interface IStreakRepository {
  load(): Promise<Streak>;
  save(streak: Streak): Promise<void>;
}
