import { InjectQueue } from '@nestjs/bull';
import { HttpException, Injectable } from '@nestjs/common';
import { QUEUES, QueueValueType } from './bull.const';
import { Job, Queue } from 'bull';
import {ITaskPayload, ITaskService} from "@application/interfaces/services/task/task-service.interface";

@Injectable()
export class BullService implements ITaskService {
  constructor(
    @InjectQueue(QUEUES.SYNC_ORGANIZATION_REVIEWS_QUEUE)
    private SYNC_ORGANIZATION_REVIEWS_QUEUE: Queue,
    @InjectQueue(QUEUES.SYNC_YANDEX_ORGANIZATION_REVIEWS_QUEUE)
    private SYNC_YANDEX_ORGANIZATION_REVIEWS_QUEUE: Queue,
    @InjectQueue(QUEUES.SEND_REVIEW_QUEUE)
    private SEND_REVIEW_QUEUE: Queue,
    @InjectQueue(QUEUES.SEND_YANDEX_REVIEW_QUEUE)
    private SEND_YANDEX_REVIEW_QUEUE: Queue,
    @InjectQueue(QUEUES.GPT_GENERATE_REVIEWS_QUEUE)
    private GPT_GENERATE_REVIEWS_QUEUE: Queue,
    @InjectQueue(QUEUES.SEND_MAIL_QUEUE)
    private SEND_MAIL_QUEUE: Queue,
    @InjectQueue(QUEUES.SEND_AMO_CRM_QUEUE)
    private SEND_AMO_CRM_QUEUE,
    @InjectQueue(QUEUES.SEND_REPLY_QUEUE)
    private SEND_REPLY_QUEUE,
    @InjectQueue(QUEUES.CREATE_SNAPSHOT_QUEUE)
    private CREATE_SNAPSHOT_QUEUE,
    @InjectQueue(QUEUES.WHATSAPP_INSTANCE_ID_QUEUE)
    private WHATSAPP_INSTANCE_ID_QUEUE: Queue,
    @InjectQueue(QUEUES.SEND_COMPLAINT_CLARIFICATION_QUEUE)
    private SEND_COMPLAINT_CLARIFICATION_QUEUE: Queue,
    @InjectQueue(QUEUES.SEND_COMPLAINT_FORMAL_QUEUE)
    private SEND_COMPLAINT_FORMAL_QUEUE: Queue,
    @InjectQueue(QUEUES.SYNC_ORGANIZATION_RATINGS_QUEUE)
    private SYNC_ORGANIZATION_RATINGS_QUEUE: Queue,
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

    if (job) return true;

    return false;
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

  async getJobCounts(queueName: string): Promise<{ waiting: number; active: number; delayed: number; completed: number; failed: number }> {
    const queue = this.getQueueByName(queueName);
    
    const jobCounts = await queue.getJobCounts();
    return {
      waiting: jobCounts.waiting || 0,
      active: jobCounts.active || 0,
      delayed: jobCounts.delayed || 0,
      completed: jobCounts.completed || 0,
      failed: jobCounts.failed || 0,
    };
  }
}
