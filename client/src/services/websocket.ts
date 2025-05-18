
import { toast } from "sonner";

type MessageType = 'eventUpdated' | 'tradeUpdated' | 'marketUpdate';

interface WebSocketMessage {
  type: MessageType;
  data: any;
}

type MessageHandler = (data: any) => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private handlers: Map<MessageType, Set<MessageHandler>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private url: string;

  constructor() {
    this.url = import.meta.env.VITE_WS_URL || 'ws://localhost:3000/ws';
    this.handlers.set('eventUpdated', new Set());
    this.handlers.set('tradeUpdated', new Set());
    this.handlers.set('marketUpdate', new Set());
  }

  public connect(): void {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const token = localStorage.getItem('authToken');
    const wsUrl = token ? `${this.url}?token=${token}` : this.url;
    
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = this.handleOpen.bind(this);
    this.socket.onmessage = this.handleMessage.bind(this);
    this.socket.onclose = this.handleClose.bind(this);
    this.socket.onerror = this.handleError.bind(this);
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
      this.reconnectAttempts = 0;
    }
  }

  public subscribe<T>(type: MessageType, handler: (data: T) => void): () => void {
    const handlers = this.handlers.get(type);
    if (handlers) {
      handlers.add(handler as MessageHandler);
    }

    return () => {
      const handlersSet = this.handlers.get(type);
      if (handlersSet) {
        handlersSet.delete(handler as MessageHandler);
      }
    };
  }

  private handleOpen(): void {
    console.log('WebSocket connection established');
    this.reconnectAttempts = 0;
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      const handlers = this.handlers.get(message.type);

      if (handlers) {
        handlers.forEach(handler => handler(message.data));
      }

      // Show notifications for certain events
      if (message.type === 'tradeUpdated' && message.data.outcome !== 'pending') {
        const outcome = message.data.outcome;
        const eventTitle = message.data.eventTitle;
        
        if (outcome === 'won') {
          toast.success(`You won your trade on "${eventTitle}"!`);
        } else if (outcome === 'lost') {
          toast.error(`You lost your trade on "${eventTitle}"`);
        }
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  private handleClose(event: CloseEvent): void {
    console.log(`WebSocket connection closed: ${event.code} ${event.reason}`);
    
    // Attempt to reconnect unless explicitly closed
    if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => this.connect(), this.reconnectDelay * this.reconnectAttempts);
    }
  }

  private handleError(event: Event): void {
    console.error('WebSocket error:', event);
  }
}

// Export as singleton
export default new WebSocketService();
