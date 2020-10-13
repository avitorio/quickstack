import { Repository, EntityRepository } from 'typeorm';
import { User } from './user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findByEmail(email: string): Promise<User> {
    const user = await this.findOne({ email });

    if (!user) {
      return null;
    }

    return user;
  }

  async getUsers(): Promise<User[]> {
    try {
      const users = this.find();
      return users;
    } catch (error) {}
  }
}
