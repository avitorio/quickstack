import {
  Injectable,
  UnauthorizedException,
  Logger,
  Inject,
} from '@nestjs/common';
import { UserRepository } from '../users/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { AuthCredentialsInput } from './dto/auth-credentials.input';
import { SessionType } from './session.type';
import IHashProvider from '../shared/providers/hash/models/hash-provider.interface';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,

    @Inject(JwtService)
    private jwtService: JwtService,

    @Inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  async signIn(
    authCredentialsInput: AuthCredentialsInput,
  ): Promise<SessionType> {
    const { email, password } = authCredentialsInput;

    const user = await this.userRepository.findOne({ email });

    if (
      user &&
      (await this.hashProvider.compareHash(password, user.password))
    ) {
      const payload: JwtPayload = { email };
      const accessToken = await this.jwtService.sign(payload);
      return {
        token: accessToken,
        user: { id: user.id, email, role: user.role },
      };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
