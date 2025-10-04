import { Rule, CreateRuleDto, UpdateRuleDto } from './rule.model';
import ruleRepository from './rule.repository';
import { ApiError } from '../../middleware/errorHandler';

interface GetAllRulesOptions {
  skip?: number;
  take?: number;
}

class RuleService {
  /**
   * Get all rules with pagination
   */
  async getAllRules(options?: GetAllRulesOptions): Promise<{ rules: Rule[]; count: number }> {
    return ruleRepository.findAll(options);
  }

  /**
   * Get rule by key
   */
  async getRuleByKey(key: string): Promise<Rule> {
    const rule = await ruleRepository.findByKey(key);

    if (!rule) {
      throw new ApiError(404, 'Rule not found');
    }

    return rule;
  }

  /**
   * Create a new rule
   */
  async createRule(data: CreateRuleDto): Promise<Rule> {
    // Check if rule with this key already exists
    const existingRule = await ruleRepository.findByKey(data.key);

    if (existingRule) {
      throw new ApiError(409, 'Rule with this key already exists');
    }

    // Validate JSON data
    try {
      // If data is a string, try to parse it
      if (typeof data.data === 'string') {
        data.data = JSON.parse(data.data);
      }

      // Otherwise, ensure it's a valid object
      if (typeof data.data !== 'object' || data.data === null) {
        throw new Error('Invalid JSON data');
      }
    } catch (error) {
      throw new ApiError(400, 'Invalid JSON data');
    }

    return ruleRepository.create(data);
  }

  /**
   * Update a rule by key
   */
  async updateRule(key: string, data: UpdateRuleDto): Promise<Rule> {
    // Check if rule exists
    const rule = await ruleRepository.findByKey(key);

    if (!rule) {
      throw new ApiError(404, 'Rule not found');
    }

    // Validate JSON data if provided
    if (data.data !== undefined) {
      try {
        // If data is a string, try to parse it
        if (typeof data.data === 'string') {
          data.data = JSON.parse(data.data);
        }

        // Otherwise, ensure it's a valid object
        if (typeof data.data !== 'object' || data.data === null) {
          throw new Error('Invalid JSON data');
        }
      } catch (error) {
        throw new ApiError(400, 'Invalid JSON data');
      }
    }

    return ruleRepository.updateByKey(key, data);
  }

  /**
   * Delete a rule by key
   */
  async deleteRule(key: string): Promise<Rule> {
    // Check if rule exists
    const rule = await ruleRepository.findByKey(key);

    if (!rule) {
      throw new ApiError(404, 'Rule not found');
    }

    return ruleRepository.deleteByKey(key);
  }
}

export default new RuleService();
