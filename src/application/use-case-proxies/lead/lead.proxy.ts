import { ProxyPrefix } from '@application/use-case-proxies/proxy-prefix';

export const LeadProxy = {
  CREATE_LEAD_USE_CASE: `${ProxyPrefix.LEAD_PROXY}CreateLeadUseCaseProxy`,

  ASSIGN_MANAGER_USE_CASE: `${ProxyPrefix.LEAD_PROXY}AssignManagerLeadUseCaseProxy`,
  CONFIRM_LEAD_USE_CASE: `${ProxyPrefix.LEAD_PROXY}ConfirmLeadUseCaseProxy`
} as const;

export const leadProxyExports = [
  LeadProxy.CREATE_LEAD_USE_CASE,
  LeadProxy.ASSIGN_MANAGER_USE_CASE,
  LeadProxy.CONFIRM_LEAD_USE_CASE
]
