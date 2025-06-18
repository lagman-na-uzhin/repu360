export const QUEUES = {
    SYNC_TWOGIS_REVIEWS: 'SYNC_TWOGIS_REVIEWS',
    SEND_REPLY_QUEUE: 'SEND_REPLY_QUEUE',

    SEND_TO_RMAIL: 'SEND_TO_RMAIL'

};

export enum QUEUE_TYPE {
    DELAY = 'delay',
    REPEAT = 'repeat',
}
export interface ITaskPayload {
    queue: QueueValueType;
    jobId: string;
    type?: QUEUE_TYPE;
    delay: number;
    attempts?: number;
    payload: object;
}

export interface ITaskService {
    addTask(payload: ITaskPayload);
    isJobExists(key: string, queue: string): Promise<boolean>;
    deleteByKey(key: string, queue: string): Promise<void>;
}

type QueueKeysType = keyof typeof QUEUES;
export type QueueValueType = (typeof QUEUES)[QueueKeysType];
