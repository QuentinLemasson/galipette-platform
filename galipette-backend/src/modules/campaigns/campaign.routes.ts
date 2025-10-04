import { Router } from 'express';
import campaignController from './campaign.controller';

const router = Router();

/**
 * @route /api/campaigns
 */
router.get('/', campaignController.getAllCampaigns);
router.post('/', campaignController.createCampaign);
router.get('/:id', campaignController.getCampaignById);
router.patch('/:id', campaignController.updateCampaign);
router.delete('/:id', campaignController.deleteCampaign);

/**
 * @route /api/campaigns/:id/players
 */
router.post('/:id/players', campaignController.addPlayerToCampaign);
router.delete('/:id/players/:playerId', campaignController.removePlayerFromCampaign);

export default router;
