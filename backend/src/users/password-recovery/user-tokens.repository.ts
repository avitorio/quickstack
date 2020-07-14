import { Repository, EntityRepository } from 'typeorm';
import { UserToken } from './user-token.entity';
import IUserTokensRepository from './user-tokens-repository.interface';

@EntityRepository(UserToken)
export class UserTokensRepository extends Repository<UserToken>
  implements IUserTokensRepository {
  public async generate(user: string): Promise<UserToken> {
    const userToken = this.create({ user });

    await userToken.save();

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = this.findOne({ token });

    if (!userToken) {
      throw new Error('Token not found');
    }

    return userToken;
  }
}
