export const loginSchema = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      example: 'foo',
    },
    password: {
      type: 'string',
      format: 'password',
      example: 'bar',
    },
  },
  required: ['email', 'password'],
};

export const signupSchema = {
  type: 'object',
  properties: {
    username: {
      type: 'string',
      format: 'username',
      example: 'ousf',
    },
    email: {
      type: 'string',
      format: 'email',
      example: 'ousf@medea.com',
    },
    password: {
      type: 'string',
      format: 'password',
      example: 'baz',
    },
  },
  required: ['email', 'password'],
};
