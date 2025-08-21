export enum MAIL_TEMPLATE_TYPE {
  EMPLOYEE_CREATED_PASSWORD = 'EMPLOYEE_CREATED_PASSWORD',
}
export interface IMail {
  id: string;
  template: MAIL_TEMPLATE_TYPE;
  userId: string;
  email: string;
  payload: object;
  created: Date;
  sendDate?: Date;
}
export interface IMailerService {
  send(payload: IMail): Promise<void>;
}
