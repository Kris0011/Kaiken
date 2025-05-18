
import api from './api';

export interface Trade {
  id: string;
  userId: string;
  username: string;
  eventId: string;
  eventName: string;
  selection: 'yes' | 'no';
  amount: number;
  status: 'pending' | 'won' | 'lost';
  price: number;
  createdAt: string;
}

export interface CreateTradeRequest {
  eventId: string;
  prediction: 'yes' | 'no';
  amount: number;
}

const tradeService = {
  getMyTrades: async (): Promise<Trade[]> => {
    const response = await api.get<Trade[]>('/trades/mytrades');
    console.log('My trades:', response.data);
    return response.data;
  },

  getAllTrades: async (): Promise<Trade[]> => {
    const response = await api.get<Trade[]>('/trades');
    console.log('All trades:', response.data);
    return response.data;
  },

  createTrade: async (data: CreateTradeRequest): Promise<Trade> => {
    const response = await api.post<Trade>('/trades', data);
    return response.data;
  },

  getTradesByEvent: async (eventId: string): Promise<Trade[]> => {
    const response = await api.get<Trade[]>(`/trades?eventId=${eventId}`);
    return response.data;
  },
};

export default tradeService;
