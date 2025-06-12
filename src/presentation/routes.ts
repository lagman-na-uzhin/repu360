export const DEFAULT_ROUTES = {
  COMPANY: {
    BASE: 'company',

    BY_ID: ':companyId', //GET
    UPDATE: ':companyId', //PATCH
  },

  ORGANIZATION: {
    BASE: 'organizations',

    GET_LIST_BY_COMPANY: ':companyId',

    USER_PERMITTED_GET_LIST: 'user'

  },

  EMPLOYEE: {
    BASE: 'employees',

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
  COMPANY: {
    BASE: 'control/companies',

    CREATE: '', //POST
    LIST: '', //GET
    BY_ID: ':companyId', //GET
    UPDATE: ':companyId', //PUT
    DELETE: ':companyId', //DELETE
  },

  SUBSCRIPTION: {
    BASE: 'control/subscriptions',

    CREATE: '',//POST
    LIST: '', //GET
    BY_ID: ':subscriptionId', //GET
    UPDATE: ':subscriptionId', //PUT

    //TARIFF
    CREATE_TARIFF: 'tariff'
  }
} as const;

export const GENERAl_ROUTES = {
  AUTH: {
    BASE: 'auth',
    EMPLOYEE_LOGIN: 'employee/login', //POST
    MANAGER_LOGIN: 'manager/login', //POST
    ME: 'me', //GET
  },
} as const;
