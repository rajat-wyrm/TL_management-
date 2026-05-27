export var standardResponses = {
  200: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      data: { type: 'object' }
    }
  },
  201: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      data: { type: 'object' }
    }
  },
  400: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' }
    }
  },
  401: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' }
    }
  },
  403: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' }
    }
  },
  429: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' },
      retryAfter: { type: 'number' }
    }
  },
  500: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      message: { type: 'string' },
      requestId: { type: 'string' }
    }
  }
};
