import { InjectQueue } from '@nestjs/bull';
import { HttpException, Injectable } from '@nestjs/common';
import { QueueValueType } from './bull.const';
import { Queue } from 'bull';
import {ITaskPayload, ITaskService, QUEUES} from "@application/interfaces/services/task/task-service.interface";

@Injectable()
export class BullService implements ITaskService {
  constructor(
      @InjectQueue(QUEUES.SEND_MAIL_QUEUE)
      private SEND_MAIL_QUEUE: Queue,
      @InjectQueue(QUEUES.SYNC_TWOGIS_REVIEWS)
      private SYNC_TWOGIS_REVIEWS: Queue,
      @InjectQueue(QUEUES.SEND_REPLY_QUEUE)
      private SEND_REPLY_QUEUE: Queue,
      @InjectQueue(QUEUES.SYNC_TWOGIS_ORGANIZATION)
      private SYNC_TWOGIS_ORGANIZATION: Queue,
  ) {}

  async addTask(task: ITaskPayload) {
    const queue = this.getQueueByName(task.queue);

    const job = await queue.getJob(task.jobId);
    const timeToRemove = 1000 * 10 * 60;
    try {
      if (job && (job?.failedReason || job?.finishedOn)) await job.remove();
      if (job?.timestamp && job.timestamp < new Date().getTime() - timeToRemove)
        await job.remove();
    } catch (err) {
      console.log('ERR_ADDING_TASK', JSON.stringify(task), err);
      throw new HttpException(err, 500);
    }

    if (job) return;

    return queue.add(task.payload, {
      jobId: task.jobId,
      attempts: !task.attempts ? 1 : task.attempts,
      delay: task.delay ? task.delay : 0,
      removeOnComplete: true,
      removeOnFail: true,
    });
  }

  async isJobExists(key: string, queueName: string): Promise<boolean> {
    const queue = this.getQueueByName(queueName);
    const job = await queue.getJob(key);

    return !!job;


  }

  async deleteByKey(key: string, queueName: string): Promise<void> {
    const queue = this.getQueueByName(queueName);
    const job = await queue.getJob(key);
    if (job) {
      await job?.remove();
    }
  }

  private list(): Record<string, Queue> {
    const list = {};
    for (const key in QUEUES) {
      const value = QUEUES[key];
      if (!this[key])
        throw new HttpException(
          `Queue ${key} is defined in constant, but not imported in info service`,
          500,
        );

      list[value] = this[key];
    }
    return list;
  }

  private getQueueByName(queueName: QueueValueType) {
    const list = this.list();
    return list[queueName];
  }
}
