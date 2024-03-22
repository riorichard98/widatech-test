export interface ValidRequestBody {
  [key: string]: 'number' | 'string' | 'boolean' | 'string[]' | 'number[]' | 'boolean[]'; // Allow string[], number[], and boolean[]
}

export interface RequestBody {
  [key: string]: any;
}

export function validateRequestBody(requestBody: RequestBody, validRequestBody: ValidRequestBody): string[] {
  // Check if requestBody is undefined or null
  if (requestBody === undefined || requestBody === null) {
    return ['Request body is missing or null'];
  }

  const requiredBody: string[] = [];
  for (const key in validRequestBody) {
    const expectedType = validRequestBody[key];
    const actualValue = requestBody[key];
    
    // Check if the expected type is an array
    const isArray = expectedType.endsWith('[]');
    const expectedBaseType = isArray ? expectedType.slice(0, -2) : expectedType;

    // If the value is an array, check each element's type
    if (isArray && Array.isArray(actualValue)) {
      for (const value of actualValue) {
        if (typeof value !== expectedBaseType) {
          requiredBody.push(`${key} array elements must be of type ${expectedBaseType}`);
          break; // No need to check further once an invalid element is found
        }
      }
    } else {
      // Otherwise, check if the single value matches the expected type
      if (actualValue === undefined || typeof actualValue !== expectedBaseType) {
        requiredBody.push(`${key} is required to be ${expectedType}`);
      }
    }
  }
  return requiredBody;
}
