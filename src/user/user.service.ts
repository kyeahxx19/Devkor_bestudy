import {
  Injectable,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Users } from 'src/entities';
import { LoginDto, SignupDto } from 'src/entities/dtos/user.dto';
import { JwtPayload } from 'src/interfaces/jwt.payload';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepo: Repository<Users>,
    private readonly jwtService: JwtService,
  ) {}

  async findById(id: number): Promise<Users> {
    return await this.userRepo.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<Users> {
    return await this.userRepo.findOne({ where: { email: email } });
  }

  async signupUser(signupUser: SignupDto) {
    const { name, email, password } = signupUser;
    if (await this.findByEmail(email)) {
      throw new HttpException('duplicated email', 409);
    }

    const newUser = await this.userRepo.create({
      name: name,
      email: email,
      password: await bcrypt.hash(password, 10),
    });
    await this.userRepo.save(newUser);
    return true;
  }

  async loginUser(loginUser: LoginDto) {
    const { email, password } = loginUser;
    const user = await this.userRepo.findOne({
      where: { email: email },
    });

    if (
      (await !bcrypt.compare(password, user.password)) ||
      !user ||
      user == undefined
    ) {
      throw new UnauthorizedException();
    }
    return await this.getToken(user.id);
  }

  async getToken(userId: number) {
    const payload: JwtPayload = {
      id: userId,
      signedAt: new Date(new Date().getTime() + 9 * 60 * 60 * 1000),
    };
    const token = await this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
    });
    return token;
  }
}
