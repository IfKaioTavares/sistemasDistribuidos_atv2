import axios from 'axios';
import { Node } from '../Node';

export class ElectionService {
  private node: Node;
  private ports: number[];
  private readonly HEARTBEAT_INTERVAL = 5000;

  constructor(node: Node, ports: number[]) {
      this.node = node;
      this.ports = ports;
      this.initializeLeader();
      this.startSimulation();
      this.startHeartbeat();
  }

  async initializeLeader(): Promise<void> {
      const allNodes = [...this.ports, this.node.id];
      const highestId = Math.max(...allNodes);
      
      this.node.leaderId = highestId;
      
      if (this.node.id === highestId) {
          console.log(`🏆 [Nó ${this.node.id}] Iniciando como COORDENADOR inicial!`);
          await this.declareLeadership();
      } else {
          console.log(`🔎 [Nó ${this.node.id}] Coordenador inicial detectado: Nó ${highestId}`);
      }
  }

  async declareLeadership(): Promise<void> {
      for (const port of this.ports) {
          try {
              await axios.post(`http://localhost:${port}/coordinator`, { coordinator: this.node.id });
          } catch (error:any) {
              console.error(`Erro ao notificar nó ${port}:`, error.message);
          }
      }
  }

  async startElection(): Promise<void> {
      if (!this.node.isAlive) return;
      console.log(`\n🔄 [Nó ${this.node.id}] Iniciando eleição...`);
      
      const higherNodes = this.ports.filter(port => port > this.node.id);
      let responses = 0;

      for (const port of higherNodes) {
          try {
              await axios.post(`http://localhost:${port}/election`, {}, { timeout: 3000 });
              responses++;
          } catch (error) {
              console.error(`🚨 [Nó ${this.node.id}] Nó ${port} não respondeu`);
          }
      }

      if (responses === 0) {
          await this.becomeLeader();
      }
  }

  async becomeLeader(): Promise<void> {
      this.node.leaderId = this.node.id;
      console.log(`🏆 [Nó ${this.node.id}] Agora sou o COORDENADOR!`);
      await this.declareLeadership();
  }

  async failNode(): Promise<void> {
      this.node.isAlive = false;
      console.log(`❌ [Nó ${this.node.id}] Falhou!`);
      
      // Recuperação automática após tempo aleatório
      setTimeout(() => this.recoverNode(), Math.random() * 10000 + 5000);
  }

  async recoverNode(): Promise<void> {
      this.node.isAlive = true;
      console.log(`✅ [Nó ${this.node.id}] Recuperado! Verificando liderança...`);
      await this.startElection();
  }

  startSimulation(): void {
      // Simulação de falha aleatória apenas para líderes
      setInterval(() => {
          if (this.node.leaderId === this.node.id && Math.random() < 0.6) {
              this.failNode();
          }
      }, 15000);
  }

  startHeartbeat(): void {
    setInterval(async () => {
        if (this.node.isAlive && 
            this.node.leaderId !== null && 
            this.node.leaderId !== this.node.id) {
            
            try {
                await axios.get(`http://localhost:${this.node.leaderId}/heartbeat`);
            } catch (error) {
                console.log(`💔 [Nó ${this.node.id}] Líder ${this.node.leaderId} não respondeu. Iniciando eleição...`);
                await this.startElection();
            }
        }
    }, this.HEARTBEAT_INTERVAL);

  }

  getNode() {
    return this.node;
  }
}