import { Router } from 'express';
import afflictionController from './affliction.controller';

const router = Router();

/**
 * @route /api/afflictions
 */
router.get('/', afflictionController.getAllAfflictions);
router.post('/', afflictionController.createAffliction);
router.get('/:id', afflictionController.getAfflictionById);
router.patch('/:id', afflictionController.updateAffliction);
router.delete('/:id', afflictionController.deleteAffliction);

/**
 * @route /api/tags
 */
const tagRouter = Router();
tagRouter.get('/', afflictionController.getAllTags);
tagRouter.post('/', afflictionController.createTag);
tagRouter.get('/:id', afflictionController.getTagById);
tagRouter.delete('/:id', afflictionController.deleteTag);

/**
 * @route /api/characters/:id/afflictions
 */
const characterAfflictionRouter = Router({ mergeParams: true });
characterAfflictionRouter.get('/', afflictionController.getCharacterAfflictions);
characterAfflictionRouter.post('/', afflictionController.applyAfflictionToCharacter);
characterAfflictionRouter.patch('/:afflictionId', afflictionController.updateCharacterAffliction);
characterAfflictionRouter.delete(
  '/:afflictionId',
  afflictionController.removeAfflictionFromCharacter,
);

export { router as afflictionRouter, tagRouter, characterAfflictionRouter };
