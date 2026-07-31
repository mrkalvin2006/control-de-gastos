export type TransactionType = 'ingreso' | 'egreso';

export type UserRole = 'caja_chica' | 'caja_central' | 'asistenta_social' | 'prensa' | 'presidente';

export interface UserProfile {
  uid: string;
  role: UserRole;
  name: string;
  email: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  date: string;
  quantity: number | '';
  description: string;
  amount: number;
  userId: string;
  userRole: UserRole;
  createdAt?: number;
}
