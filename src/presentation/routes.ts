export const DEFAULT_ROUTES = {
  AUTH: {
    BASE: 'auth',
    LOGIN: 'login', //POST
  },

  COMPANY: {
    BASE: 'company',

    MY: ':companyId', //GET
    UPDATE: ':companyId', //PATCH
  },

  EMPLOYEE: {
    BASE: 'employees',

    ME: 'me', //GET
    CREATE: '', //POST
    LIST: ':companyId', //GET
    BY_ID: ':employeeId', //GET
    UPDATE: ':employeeId', //PATCH
    DELETE: ':employeeId', //DELETE
  },

  REVIEW: {
    BASE: 'reviews',

    LIST: '', //GET
    BY_ID: ':reviewId', //GET


    BY_ID_REPLY: 'reply/:replyId', //GET
    CREATE_REPLY: 'reply/:replyId', //POST
    UPDATE_REPLY: 'reply/:replyId', //PATCH
    DELETE_REPLY: 'reply/:replyId', //DELETE
  },

} as const;

export const CONTROL_ROUTES = {
  AUTH: {
    BASE: 'control/auth',
    LOGIN: 'login', //POST
  },

  COMPANY: {
    BASE: 'control/companies',

    CREATE: '', //POST
    LIST: '', //GET
    BY_ID: ':companyId', //GET
    UPDATE: ':companyId', //PATCH
  }
} as const;
