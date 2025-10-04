import { Router } from 'express';
import raceController from './race.controller';

const router = Router();

/**
 * @route /api/races
 */
router.get('/', raceController.getAllRaces);
router.post('/', raceController.createRace);
router.get('/:id', raceController.getRaceById);
router.patch('/:id', raceController.updateRace);
router.delete('/:id', raceController.deleteRace);

export default router;
