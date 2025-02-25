import axios from "axios";
import { ILamportClock } from "../interfaces/ILamportClock";
import { LamportClock } from "../LamportClock";

export class LamportClockService implements ILamportClock{
  private lamportClock: LamportClock
  private nodePort: number;

  constructor(nodePort: number) {
    this.lamportClock = LamportClock.getInstance();
    this.nodePort = nodePort;
  }

  private increment(): void {
    this.lamportClock.setTime(this.lamportClock.getTime() + 1);
  }

  async sendEvent(targetPort: number): Promise<void> {
    this.increment();
    try{
      await axios.post(`http://localhost:${targetPort}/message`, { timestamp: this.lamportClock.getTime() });
      console.log(`📨 [Nó ${this.nodePort}] Mensagem enviada para ${targetPort} | Clock: ${this.lamportClock.getTime()}`);
    } catch (error: any)  {
      console.error(`❌ Erro ao enviar mensagem para ${targetPort}`, error.message);
    }
  }

  receiveEvent(receivedClock: number): void {
    this.lamportClock.setTime(Math.max(this.lamportClock.getTime(), receivedClock) + 1);
    console.log(`📥 [Nó ${this.nodePort}] Evento recebido | Clock atualizado: ${this.lamportClock.getTime()}`);
  }
}