import { ProxyPrefix } from '@application/use-case-proxies/proxy-prefix';

export enum ReviewProxy {
  // SYNC
  TWOGIS_SYNC_REVIEWS_PROCESS_USE_CASE = `${ProxyPrefix.REVIEW_PROXY}SyncReviewsProcessUseCaseProxy`,
  TWOGIS_SYNC_REVIEWS_SCHEDULE_USE_CASE = `${ProxyPrefix.REVIEW_PROXY}SyncReviewsProcessUseCaseProxy`,


  //AUTO-REPLY
  TWOGIS_CREATE_SEND_REPLY_TASK_SH_USE_CASE = `${ProxyPrefix.REVIEW_PROXY}TwogisCreateSendReplyTaskScheduleUseCaseProxy`,
  TWOGIS_SEND_REPLY_PC_USE_CASE = `${ProxyPrefix.REVIEW_PROXY}TwogisSendReplyProcessUseCaseProxy`,

}
export const reviewProxyExports = [
  ReviewProxy.TWOGIS_SYNC_REVIEWS_PROCESS_USE_CASE,
    ReviewProxy.TWOGIS_SYNC_REVIEWS_SCHEDULE_USE_CASE,
    ReviewProxy.TWOGIS_CREATE_SEND_REPLY_TASK_SH_USE_CASE,
    ReviewProxy.TWOGIS_SEND_REPLY_PC_USE_CASE
]
