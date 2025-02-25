export class LamportClock {
  private clock: number;
  private static instance: LamportClock;

  constructor() {
    this.clock = 0;
  }

  getTime(): number {
    return this.clock;
  }

  setTime(time: number): void {
    this.clock = time;
  }

  static getInstance(): LamportClock {
    if (!LamportClock.instance) {
      LamportClock.instance = new LamportClock();
    }
    return LamportClock.instance;
  }
}

