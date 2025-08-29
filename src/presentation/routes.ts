export const DEFAULT_ROUTES = {
  COMPANY: {
    BASE: 'api/company',

    BY_ID: ':companyId', //GET
    UPDATE: ':companyId', //PATCH
  },

  ORGANIZATION: {
      BASE: 'api/organizations',
      ADD: '',
      GET_LIST: '',
      COMPACT_ORGANIZATIONS: 'c',
      SUMMARY: 'summary',
      UPDATE: ':organizationId'
  },

  EMPLOYEE: {
    BASE: 'api/employees',

    CREATE: '', //POST
    LIST: '', //GET
    BY_ID: ':employeeId', //GET
    UPDATE: ':employeeId', //PATCH
    DELETE: ':employeeId', //DELETE
  },

  REVIEW: {
    BASE: 'api/reviews',

    LIST: '', //GET
    BY_ID: ':reviewId', //GET


    BY_ID_REPLY: 'reply/:replyId', //GET
    CREATE_REPLY: 'reply/:replyId', //POST
    UPDATE_REPLY: 'reply/:replyId', //PATCH
    DELETE_REPLY: 'reply/:replyId', //DELETE
  },

  MANAGER: {
    BASE: 'api/managers',

    BY_ID: ':managerId', //GET
  },

  ROLE: {
    BASE: 'api/roles',

    ROLES: '',
    CREATE_EMPLOYEE_ROLE: 'employee', //POST
  },

  EXTERNAL: {
      BASE: 'api/external',
      GOOGLE_PLACES_SEARCH: 'google/places-search',
      TWOGIS_SEARCH_RUBRICS: 'twogis/rubrics-search'
  }

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
  },

  LEAD: {
    BASE: 'control/leads',

    ASSIGN: 'assign', //PATCH
    CONFIRM: 'confirm' //POST
  }
} as const;

export const GENERAl_ROUTES = {
  AUTH: {
    BASE: 'auth',
    EMPLOYEE_LOGIN: 'default/login', //POST
    MANAGER_LOGIN: 'control/login-admin', //POST
    ME: 'me', //GET
  },

  LANDING: {
    BASE: 'landing',

    CREATE_LEAD: 'lead', //POST

  }
} as const;
