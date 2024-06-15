export const createTaskValidation = {
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

export const updateTaskValidation = {
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
    additionalProperties: false,
}