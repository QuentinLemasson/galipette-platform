import express from 'express';
import userRoutes from '../modules/users/user.routes';
import campaignRoutes from '../modules/campaigns/campaign.routes';
import characterRoutes from '../modules/characters/character.routes';
import raceRoutes from '../modules/races/race.routes';
import {
  afflictionRouter,
  tagRouter,
  characterAfflictionRouter,
} from '../modules/afflictions/affliction.routes';
import ruleRoutes from '../modules/rules/rule.routes';

// Router instance
const router = express.Router();

/**
 * Health check endpoint
 */
router.get('/health', (_, res) => {
  res.status(200).json({ status: 'ok' });
});

// API Routes
router.use('/users', userRoutes);
router.use('/campaigns', campaignRoutes);
router.use('/characters', characterRoutes);
router.use('/races', raceRoutes);
router.use('/afflictions', afflictionRouter);
router.use('/tags', tagRouter);
router.use('/characters/:id/afflictions', characterAfflictionRouter);
router.use('/rules', ruleRoutes);

// Export router
export default router;
