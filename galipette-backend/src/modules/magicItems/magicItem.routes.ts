/**
 * @fileOverview Express routers for magic items and their types.
 *
 * Two separate routers are exported because each lives at its own URL prefix:
 * - magicItemRouter      -> /api/magic-items
 * - magicItemTypeRouter  -> /api/magic-item-types
 */
import { Router } from 'express';
import magicItemController from './magicItem.controller';

const magicItemRouter = Router();

magicItemRouter.get('/', magicItemController.getAllMagicItems);
magicItemRouter.post('/', magicItemController.createMagicItem);
magicItemRouter.get('/:id', magicItemController.getMagicItemById);
magicItemRouter.patch('/:id', magicItemController.updateMagicItem);
magicItemRouter.delete('/:id', magicItemController.deleteMagicItem);

const magicItemTypeRouter = Router();

magicItemTypeRouter.get('/', magicItemController.getAllMagicItemTypes);
magicItemTypeRouter.post('/', magicItemController.createMagicItemType);
magicItemTypeRouter.get('/:id', magicItemController.getMagicItemTypeById);
magicItemTypeRouter.patch('/:id', magicItemController.updateMagicItemType);
magicItemTypeRouter.delete('/:id', magicItemController.deleteMagicItemType);

export { magicItemRouter, magicItemTypeRouter };
