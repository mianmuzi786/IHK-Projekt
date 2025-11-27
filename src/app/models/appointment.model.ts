export interface Appointment {
  id: number;              // immer number, nie null
  title: string;
  date: string;
  time?: string;
  duration?: number;
  personName?: string;
  withWhom?: string;
  purpose?: string;
  email?: string;
  status?: string;
}
