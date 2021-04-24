import csvParse from 'csv-parse';
import fs from 'fs';
import { getCustomRepository, getRepository, In } from 'typeorm';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface TransactionCsvRow {
  title: string;
  value: number;
  category: string;
  type: 'outcome' | 'income';
}

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const transactionRows: TransactionCsvRow[] = [];
    const categories: string[] = [];
    const readStream = fs.createReadStream(filePath);

    const parser = csvParse({
      from_line: 2,
    });

    readStream.pipe(parser).on('data', async row => {
      const [title, type, value, category] = row.map((cell: string) => cell.trim());

      if (!title || !type || !value || !category) return;

      const newTransaction: TransactionCsvRow = {
        title,
        type,
        value,
        category,
      };
      categories.push(category);
      transactionRows.push(newTransaction);
    });

    await new Promise(resolve => readStream.on('end', resolve));

    await fs.promises.unlink(filePath);

    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    const existentCategories = await categoriesRepository.find({
      where: {
        title: In(categories),
      },
    });

    const existentCategoriesTitles = existentCategories.map(category => category.title);

    // Remove títulos duplicados
    let categoriesToInsert = categories.filter((value, index, self) => self.indexOf(value) === index);

    categoriesToInsert = categoriesToInsert.filter(category => !existentCategoriesTitles.includes(category));

    let createdCategories: Category[] = [];
    console.log('Categories to insert: ', categoriesToInsert);

    createdCategories = categoriesRepository.create(
      categoriesToInsert.map(category => ({
        title: category,
      })),
    );

    createdCategories = await categoriesRepository.save(createdCategories);

    const finalCategories = [...createdCategories, ...existentCategories];

    const createdTransactions = transactionsRepository.create(
      transactionRows.map(transaction => ({
        title: transaction.title,
        type: transaction.type,
        value: transaction.value,
        category: finalCategories.find(category => category.title === transaction.category),
      })),
    );

    await transactionsRepository.save(createdTransactions);

    return createdTransactions;
  }
}

export default ImportTransactionsService;
