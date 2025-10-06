import { Router } from 'express';
import ancestryController from './ancestry.controller';

const router = Router();

/**
 * @route /api/ancestries
 */
router.get('/', ancestryController.getAllAncestries);
router.post('/', ancestryController.createAncestry);
router.get('/:id', ancestryController.getAncestryById);
router.patch('/:id', ancestryController.updateAncestry);
router.delete('/:id', ancestryController.deleteAncestry);

export default router;
