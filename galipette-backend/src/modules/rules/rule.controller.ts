import { Request, Response } from 'express';
import ruleService from './rule.service';
import { mapToRuleDto, CreateRuleDto, UpdateRuleDto } from './rule.model';
import { formatSuccess, formatError } from '../../utils/responseFormatter';
import { parsePaginationParams } from '../../utils/queryParser';
import { ApiError } from '../../middleware/errorHandler';

export class RuleController {
  /**
   * Get all rules with pagination
   */
  async getAllRules(req: Request, res: Response): Promise<void> {
    try {
      // Parse query parameters
      const { skip, take } = parsePaginationParams(
        req.query.page as string,
        req.query.limit as string,
      );

      // Get rules from service
      const { rules, count } = await ruleService.getAllRules({
        skip,
        take,
      });

      // Map to DTOs
      const ruleDtos = rules.map((r) => mapToRuleDto(r));

      // Send response with pagination metadata
      res.status(200).json(
        formatSuccess(ruleDtos, {
          page: skip / take + 1,
          limit: take,
          total: count,
          totalPages: Math.ceil(count / take),
        }),
      );
    } catch (error) {
      res.status(500).json(formatError('Failed to retrieve rules'));
    }
  }

  /**
   * Get rule by key
   */
  async getRuleByKey(req: Request, res: Response): Promise<void> {
    try {
      const key = req.params.key;

      if (!key) {
        throw new ApiError(400, 'Rule key is required');
      }

      // Get rule
      const rule = await ruleService.getRuleByKey(key);

      res.status(200).json(formatSuccess(mapToRuleDto(rule)));
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(formatError(error.message));
      } else {
        res.status(500).json(formatError('Failed to retrieve rule'));
      }
    }
  }

  /**
   * Create a new rule
   */
  async createRule(req: Request, res: Response): Promise<void> {
    try {
      const ruleData: CreateRuleDto = req.body;

      // Validate request body
      if (!ruleData.key || ruleData.data === undefined) {
        throw new ApiError(400, 'Rule key and data are required');
      }

      const newRule = await ruleService.createRule(ruleData);
      res.status(201).json(formatSuccess(mapToRuleDto(newRule)));
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(formatError(error.message));
      } else {
        res.status(500).json(formatError('Failed to create rule'));
      }
    }
  }

  /**
   * Update a rule
   */
  async updateRule(req: Request, res: Response): Promise<void> {
    try {
      const key = req.params.key;
      const ruleData: UpdateRuleDto = req.body;

      if (!key) {
        throw new ApiError(400, 'Rule key is required');
      }

      const updatedRule = await ruleService.updateRule(key, ruleData);
      res.status(200).json(formatSuccess(mapToRuleDto(updatedRule)));
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(formatError(error.message));
      } else {
        res.status(500).json(formatError('Failed to update rule'));
      }
    }
  }

  /**
   * Delete a rule
   */
  async deleteRule(req: Request, res: Response): Promise<void> {
    try {
      const key = req.params.key;

      if (!key) {
        throw new ApiError(400, 'Rule key is required');
      }

      await ruleService.deleteRule(key);
      res.status(204).send();
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json(formatError(error.message));
      } else {
        res.status(500).json(formatError('Failed to delete rule'));
      }
    }
  }
}

export default new RuleController();
