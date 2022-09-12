import { Router } from 'express';
import * as TodoHandlers from './todos.handlers';
import { validateRequest } from '../../middlewares';
import { Todo } from './todos.model';
import { ParamsWithId } from '../../interfaces/ParamsWithId';

const router = Router();

// find all
router.get('/', TodoHandlers.findAll);

// find one
router.get(
  '/:id',
  validateRequest({
    params: ParamsWithId,
  }),
  TodoHandlers.findOne,
);

// create one
router.post(
  '/',
  validateRequest({
    body: Todo,
  }),
  TodoHandlers.createOne,
);

// update one
router.put(
  '/:id',
  validateRequest({
    params: ParamsWithId,
    body: Todo,
  }),
  TodoHandlers.updateOne,
);

// delete one
router.delete(
  '/:id',
  validateRequest({
    params: ParamsWithId,
  }),
  TodoHandlers.deleteOne,
);

export default router;
