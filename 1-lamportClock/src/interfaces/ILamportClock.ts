export interface ILamportClock {
  sendEvent(targertPort: number ): Promise<void>;
  receiveEvent(receivedClock: number): void;
}