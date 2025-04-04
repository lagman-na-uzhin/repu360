
export interface IMailerService {
  send(payload: any);
  fetchPassword(username: string);
}
