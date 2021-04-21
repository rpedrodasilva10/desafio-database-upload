import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface DeleTransactionRequest {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: DeleTransactionRequest): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transaction = await transactionsRepository.findOne(id);

    if (!transaction) {
      throw new AppError(`Could not find transaction with id: '${id}'`, 400);
    }

    await transactionsRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
