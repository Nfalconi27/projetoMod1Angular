export interface Transfer {
  id: string;
  date: string;
  description?: string;
  amount: number;
  destAccount: string
}