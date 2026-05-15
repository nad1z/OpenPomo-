export class Duration {
  private readonly _seconds: number;

  private constructor(seconds: number) {
    if (seconds < 0) throw new Error('Duration cannot be negative');
    this._seconds = Math.floor(seconds);
  }

  static fromSeconds(seconds: number): Duration {
    return new Duration(seconds);
  }

  static fromMinutes(minutes: number): Duration {
    return new Duration(minutes * 60);
  }

  static zero(): Duration {
    return new Duration(0);
  }

  get seconds(): number {
    return this._seconds;
  }

  get minutes(): number {
    return Math.floor(this._seconds / 60);
  }

  get hours(): number {
    return Math.floor(this._seconds / 3600);
  }

  get displayMinutes(): number {
    return Math.floor(this._seconds / 60);
  }

  get displaySeconds(): number {
    return this._seconds % 60;
  }

  get formatted(): string {
    const m = String(this.displayMinutes).padStart(2, '0');
    const s = String(this.displaySeconds).padStart(2, '0');
    return `${m}:${s}`;
  }

  subtract(other: Duration): Duration {
    return new Duration(Math.max(0, this._seconds - other._seconds));
  }

  add(other: Duration): Duration {
    return new Duration(this._seconds + other._seconds);
  }

  isZero(): boolean {
    return this._seconds === 0;
  }

  isGreaterThan(other: Duration): boolean {
    return this._seconds > other._seconds;
  }

  equals(other: Duration): boolean {
    return this._seconds === other._seconds;
  }

  get progress(): number {
    return this._seconds;
  }
}
