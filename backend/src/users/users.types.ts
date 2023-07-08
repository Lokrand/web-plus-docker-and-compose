import { Request } from '@nestjs/common';

export interface IGetMe extends Request {
  user: {
    [key: string]: any;
  };
}
