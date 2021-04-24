import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface CreateTransactionRequest {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}
class CreateTransactionService {
  public async execute({ title, value, type, category }: CreateTransactionRequest): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    if (type !== 'income' && type !== 'outcome') {
      throw new AppError(`Invalid transaction type: '${type}'`, 400);
    }

    if (type === 'outcome') {
      const balance = await transactionsRepository.getBalance();

      if (balance.total - value < 0) throw new AppError(`Not enough balance to perform this operation`, 400);
    }

    let categoryInstance = await categoriesRepository.findOne({
      where: {
        title: category,
      },
    });

    if (!categoryInstance) {
      // Caso não exista categoria, crio uma nova
      const newCategory = categoriesRepository.create({
        title: category,
      });

      await categoriesRepository.save(newCategory);

      categoryInstance = newCategory;
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: categoryInstance.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
