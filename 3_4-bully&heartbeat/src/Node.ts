export class Node {
  id: number;
  leaderId: number | null;
  isAlive: boolean;

  constructor(id: number) {
      this.id = id;
      this.leaderId = null;
      this.isAlive = true;
  }
}