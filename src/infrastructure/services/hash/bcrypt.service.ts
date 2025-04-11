import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {IHashService} from "@application/interfaces/services/hash/hash-service.interface";

@Injectable()
export class BcryptService implements IHashService {
  async hash(hashString: string): Promise<string> {
    return await bcrypt.hash(hashString, 10);
  }

  async compare(password: string, hashPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashPassword);
  }
}
