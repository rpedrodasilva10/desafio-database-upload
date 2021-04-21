// import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';

interface CreateTransactionRequest {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}
class CreateTransactionService {
  public async execute({ title, value, type, category }: CreateTransactionRequest): Promise<Transaction> {
    // TODO
    const;
  }
}

export default CreateTransactionService;
