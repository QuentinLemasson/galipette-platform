/**
 * Parse field projection from query parameter
 * @param fieldsParam - The fields parameter (comma-separated string)
 * @returns Object with field selections for Prisma
 */
export function parseFieldsParam(fieldsParam?: string): Record<string, boolean> | undefined {
  if (!fieldsParam) {
    return undefined;
  }

  const fields = fieldsParam.split(',').map((field) => field.trim());

  if (fields.length === 0) {
    return undefined;
  }

  // Create an object with field selections
  const fieldSelection: Record<string, boolean> = {};
  fields.forEach((field) => {
    fieldSelection[field] = true;
  });

  return fieldSelection;
}

/**
 * Parse array of IDs from query parameter
 * @param idsParam - The ids parameter (comma-separated string)
 * @returns Array of numeric IDs
 */
export function parseIdsParam(idsParam?: string): number[] | undefined {
  if (!idsParam) {
    return undefined;
  }

  const ids = idsParam
    .split(',')
    .map((id) => parseInt(id.trim()))
    .filter((id) => !isNaN(id));

  return ids.length > 0 ? ids : undefined;
}

/**
 * Parse pagination parameters
 * @param pageParam - The page parameter (1-based)
 * @param limitParam - The limit parameter (items per page)
 * @returns Object with skip and take values for Prisma
 */
export function parsePaginationParams(
  pageParam?: string,
  limitParam?: string,
): { skip: number; take: number } {
  const defaultLimit = 10;
  const maxLimit = 100;

  const page = pageParam ? Math.max(1, parseInt(pageParam)) : 1;
  let limit = limitParam ? parseInt(limitParam) : defaultLimit;

  // Ensure limit is within bounds
  limit = Math.min(Math.max(1, limit), maxLimit);

  return {
    skip: (page - 1) * limit,
    take: limit,
  };
}
