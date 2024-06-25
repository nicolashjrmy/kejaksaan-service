import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  private readonly users = [
    {
      id: 1,
      username: 'test',
      password: bcrypt.hashSync('12345', 10),
    },
  ];

  async findOne(username: string) {
    return this.users.find((user) => user.username === username);
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.findOne(username);
    if (user && bcrypt.compareSync(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
