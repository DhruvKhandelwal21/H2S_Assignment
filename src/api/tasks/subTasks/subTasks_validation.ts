export const createSubTaskValidation = {
    type: "object",
    properties: {
      subject: {
        type: "string",
      },
      deadline: {
        type: "string",
      },
      status: {
        type: "string"
      }
    },
    required: ["subject", "deadline", "status"],
    additionalProperties: false,
}

export const updateSubTaskValidation = {
    type: 'object',
    required: ['subTasks'],
    properties: {
      subTasks: {
        type: 'array',
        items: {
          type: 'object',
          required: ['_id', 'deletion'],
          properties: {
            _id: {
              type: 'string', 
            },
            subject: {
              type: 'string',
            },
            deadline: {
              type: 'string',
            },
            status: {
              type: 'string',
            },
            deletion: {
              type: 'boolean',
              enum: [false]
            }
          },
          additionalProperties: false,
        }
      }
    },
    additionalProperties: false,
}