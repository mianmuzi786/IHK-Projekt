export interface Appointment {
  id: number;
  title: string;
  date: string;
  time: string;
  // duration: string;  <-- ALT (löschen)
  duration: number;  // <-- NEU (passend zum Service)
  personName: string;
  withWhom: string;
  purpose: string;
  email: string;
  status: 'pending' | 'confirmed' | 'rejected';
}