
import api from './api';

export interface Event {
  _id: string;
  name: string;
  description: string;
  status: 'upcoming' | 'live' | 'resolved';
  result: 'yes' | 'no' | null;
  startTime: string;
  createdAt: string;
  updatedAt: string;
  currentYesPrice: number;
  totalYesVolume: number;
  totalNoVolume: number;
  winningOutcome: 'yes' | 'no' | null;
  image: string | null;
}

export interface CreateEventRequest {
  name: string;
  description: string;
  startTime: string;
  status?: 'upcoming' | 'live' | 'resolved';
  currentYesPrice?: number;
  image?: File | null;
}

export interface UpdateEventStatusRequest {
  status: 'upcoming' | 'live' | 'resolved';
  result?: 'yes' | 'no' | null;
}

const eventService = {
  getEvents: async (): Promise<Event[]> => {
    const response = await api.get<Event[]>('/events');
    return response.data;
  },

  getEvent: async (id: string): Promise<Event> => {
    const response = await api.get<Event>(`/events/${id}`);
    return response.data;
  },

  createEvent: async (data: CreateEventRequest): Promise<Event> => {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('startTime', data.startTime);
    if (data.status) formData.append('status', data.status);
    if (data.currentYesPrice !== undefined) formData.append('currentYesPrice', data.currentYesPrice.toString());
    if (data.image) formData.append('image', data.image); // this is the file

    const response = await api.post<Event>('/events', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },


  updateEvent: async (id: string, data: Partial<CreateEventRequest>): Promise<Event> => {
    const response = await api.put<Event>(`/events/${id}`, data);
    return response.data;
  },

  updateEventStatus: async (id: string, data: UpdateEventStatusRequest): Promise<Event> => {
    const response = await api.put<Event>(`/events/${id}/status`, data);
    return response.data;
  },

  deleteEvent: async (id: string): Promise<void> => {
    await api.delete(`/events/${id}`);
  },
};

export default eventService;
