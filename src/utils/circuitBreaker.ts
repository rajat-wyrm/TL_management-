enum State { CLOSED, OPEN, HALF_OPEN }

export class CircuitBreaker {
  private state = State.CLOSED;
  private failureCount = 0;
  private lastFailureTime = 0;
  private successCount = 0;
  
  constructor(
    private name: string,
    private failureThreshold: number = 5,
    private resetTimeout: number = 30000,
    private halfOpenMax: number = 3
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === State.OPEN) {
      if (Date.now() - this.lastFailureTime > this.resetTimeout) {
        this.state = State.HALF_OPEN;
        console.log('Circuit ' + this.name + ' -> HALF_OPEN');
      } else {
        throw new Error('Circuit breaker OPEN for ' + this.name);
      }
    }

    try {
      var result = await fn();
      this.onSuccess();
      return result;
    } catch (err) {
      this.onFailure();
      throw err;
    }
  }

  private onSuccess(): void {
    if (this.state === State.HALF_OPEN) {
      this.successCount++;
      if (this.successCount >= this.halfOpenMax) {
        this.state = State.CLOSED;
        this.failureCount = 0;
        console.log('Circuit ' + this.name + ' -> CLOSED');
      }
    } else {
      this.failureCount = 0;
    }
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.state === State.HALF_OPEN || this.failureCount >= this.failureThreshold) {
      this.state = State.OPEN;
      console.log('Circuit ' + this.name + ' -> OPEN');
    }
  }

  getState(): string { return State[this.state]; }
}

export var dbBreaker = new CircuitBreaker('database', 5, 30000, 3);
export var redisBreaker = new CircuitBreaker('redis', 3, 15000, 2);
