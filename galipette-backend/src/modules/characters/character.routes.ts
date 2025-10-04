import { Router } from 'express';
import characterController from './character.controller';

const router = Router();

/**
 * @route /api/characters
 */
router.get('/', characterController.getAllCharacters);
router.post('/', characterController.createCharacter);
router.get('/:id', characterController.getCharacterById);
router.patch('/:id', characterController.updateCharacter);
router.delete('/:id', characterController.deleteCharacter);

/**
 * @route /api/characters/:id/attributes
 */
router.patch('/:id/attributes', characterController.updateCharacterAttributes);
router.patch('/:id/attributes/:attrType', characterController.updateCharacterAttribute);

export default router;
