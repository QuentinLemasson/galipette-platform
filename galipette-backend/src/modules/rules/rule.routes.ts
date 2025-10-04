import { Router } from 'express';
import ruleController from './rule.controller';

const router = Router();

/**
 * @route /api/rules
 */
router.get('/', ruleController.getAllRules);
router.post('/', ruleController.createRule);
router.get('/:key', ruleController.getRuleByKey);
router.patch('/:key', ruleController.updateRule);
router.delete('/:key', ruleController.deleteRule);

export default router;
