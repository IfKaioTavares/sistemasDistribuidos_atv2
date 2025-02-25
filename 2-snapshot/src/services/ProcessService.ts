import axios from 'axios';

export class ProcessService {
  private port: number;
  private neighbors: string[] = [];
  private state: { processId: number; localState: string; receivedMessages: string[] };
  private recording: boolean = false;
  private channelBuffer: Record<string, string[]> = {};
  private markersReceived: Set<string> = new Set();

  constructor(port: number) {
    this.port = port;
    this.state = { processId: port, localState: `State of ${port}`, receivedMessages: [] };
  }

  connect(neighbor: string) {
    if (!this.neighbors.includes(neighbor)) {
      this.neighbors.push(neighbor);
      this.channelBuffer[neighbor] = [];
    }
  }

  async sendMessage(to: string, message: string) {
    if (!this.neighbors.includes(to)) return;

    console.log(`Process ${this.port} sends message to ${to}: ${message}`);
    try {
      await axios.post(`http://localhost:${to}/process/receive`, { from: this.port, message });
      if (this.recording) {
        this.channelBuffer[to]?.push(message);
      }
    } catch (error: any) {
      console.error(`Error sending message to ${to}:`, error.message);
    }
  }

  receiveMessage(from: string, message: string) {
    console.log(`Process ${this.port} received message from ${from}: ${message}`);

    if (this.recording) {
      this.channelBuffer[from] = this.channelBuffer[from] || [];
      this.channelBuffer[from].push(message);
    } else {
      this.state.receivedMessages.push(message);
    }
  }

  initiateSnapshot() {
    console.log(`Process ${this.port} initiates snapshot.`);
    
    this.recordState();
    this.sendMarkerToNeighbors();
  }

  async receiveMarker(from: string) {
    if (!this.recording) {
      console.log(`Process ${this.port} starts recording state.`);
      this.recordState();
      await this.sendMarkerToNeighbors();
    } else {
      console.log(`Process ${this.port} received late MARKER from ${from}.`);
    }
    
    this.markersReceived.add(from);
    this.checkSnapshotCompletion();
  }

  async sendMarkerToNeighbors() {
    await Promise.all(this.neighbors.map(async neighbor => {
      console.log(`Process ${this.port} sends MARKER to ${neighbor}`);
      try {
        await axios.post(`http://localhost:${neighbor}/process/marker`, { from: this.port });
      } catch (error: any) {
        console.error(`Error sending marker to ${neighbor}:`, error.message);
      }
    }));
  }

  checkSnapshotCompletion() {
    if (this.markersReceived.size === this.neighbors.length) {
      console.log(`Process ${this.port} completed its snapshot.`);
      this.recording = false;
    }
  }

  getState() {
    return { ...this.state, channelBuffer: this.channelBuffer };
  }

  private recordState() {
    this.recording = true;
    this.state.localState = `Recorded state of ${this.port}`;
    this.markersReceived.clear();
    Object.keys(this.channelBuffer).forEach(key => this.channelBuffer[key] = []);
  }
}
