export type Transaction = {
    id: string;
    amount: number;
    date: string;
    category: string;
    type: 'income' | 'expense';
    note?: string;
};

export type TransactionFormData = {
    amount: number;
    date: string;
    category: string;
    type: 'income' | 'expense';
    note?: string;
}