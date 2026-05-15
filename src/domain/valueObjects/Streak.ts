export class Streak {
  private readonly _current: number;
  private readonly _longest: number;
  private readonly _lastActivityDate: string | null;

  private constructor(current: number, longest: number, lastActivityDate: string | null) {
    this._current = current;
    this._longest = longest;
    this._lastActivityDate = lastActivityDate;
  }

  static initial(): Streak {
    return new Streak(0, 0, null);
  }

  static reconstitute(current: number, longest: number, lastActivityDate: string | null): Streak {
    return new Streak(current, longest, lastActivityDate);
  }

  extend(date: string): Streak {
    const newCurrent = this._current + 1;
    const newLongest = Math.max(newCurrent, this._longest);
    return new Streak(newCurrent, newLongest, date);
  }

  reset(date: string): Streak {
    return new Streak(1, this._longest, date);
  }

  get current(): number {
    return this._current;
  }

  get longest(): number {
    return this._longest;
  }

  get lastActivityDate(): string | null {
    return this._lastActivityDate;
  }

  isActiveOn(date: string): boolean {
    return this._lastActivityDate === date;
  }
}
