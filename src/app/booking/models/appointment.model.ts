export interface Appointment {
  id?: number;
  title: string;
  description?: string;
  date: string;
  time: string;
  duration?: number;
  status: 'pending' | 'confirmed' | 'rejected';
  userId: number;
}
