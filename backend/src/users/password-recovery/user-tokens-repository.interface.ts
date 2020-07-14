import { UserToken } from './user-token.entity';

export default interface IUserTokensRepository {
  generate(user: string): Promise<UserToken>;
  findByToken(token: string): Promise<UserToken | undefined>;
}
