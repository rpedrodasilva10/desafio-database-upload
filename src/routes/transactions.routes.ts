import { Router } from 'express';

// import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  // TODO
});

transactionsRouter.post('/', async (request, response) => {
  /**
   * POST /transactions: A rota deve receber title, value, type, e category dentro do corpo da requisição,
   * sendo o type o tipo da transação, que deve ser income para entradas (depósitos) e outcome para saídas (retiradas).
   * Ao cadastrar uma nova transação, ela deve ser armazenada dentro do seu banco de dados, possuindo os
   * campos id, title, value, type, category_id, created_at, updated_at.
   * Dica: Para a categoria, você deve criar uma nova tabela, que terá os campos id, title, created_at, updated_at.
   */
  const createTransactionService = new CreateTransactionService();

  const { title, value, type, category } = request.body;

  const transaction = await createTransactionService.execute({ title, value, type, category });

  response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  // TODO
});

transactionsRouter.post('/import', async (request, response) => {
  // TODO
});

export default transactionsRouter;
