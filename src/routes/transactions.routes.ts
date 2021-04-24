import { Router } from 'express';
import multer from 'multer';
import { getCustomRepository } from 'typeorm';
import uploadConfig from '../config/upload';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const upload = multer(uploadConfig);

// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionsRepository.find();
  const balance = await transactionsRepository.getBalance();

  const transactionsWithoutCategoryId = transactions.map(({ category_id, ...transaction }) => transaction);

  response.json({ transactions: transactionsWithoutCategoryId, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const createTransactionService = new CreateTransactionService();

  const { title, value, type, category } = request.body;

  const transaction = await createTransactionService.execute({ title, value, type, category });

  response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const deleteTransactionService = new DeleteTransactionService();
  const { id } = request.params;

  await deleteTransactionService.execute({ id });

  return response.status(200).json();
});

transactionsRouter.post('/import', upload.single('file'), async (request, response) => {
  const filePath = request.file.path;

  const imporTransactionsService = new ImportTransactionsService();

  const transactions = await imporTransactionsService.execute(filePath);

  return response.json(transactions);
});

export default transactionsRouter;
