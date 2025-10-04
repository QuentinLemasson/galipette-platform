import { Router } from 'express';
import userController from './user.controller';

const router = Router();

/**
 * @route /api/players
 */
router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.get('/:id', userController.getUserById);
router.patch('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;
