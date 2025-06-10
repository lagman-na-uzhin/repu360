import {QUEUES} from "@application/interfaces/services/task/task-service.interface";

export const queueInjectionList = () => {
  const array: { name: string }[] = [];
  for (const key in QUEUES) {
    const value = QUEUES[key];
    array.push({ name: value });
  }
  return array;
};

type QueueKeysType = keyof typeof QUEUES;
export type QueueValueType = (typeof QUEUES)[QueueKeysType];
