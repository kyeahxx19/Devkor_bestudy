import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import { LoginDto, SignupDto } from 'src/entities/dtos/user.dto';
import { JwtGuard } from 'src/guard/jwt.guard';
import { JwtPayload } from 'src/interfaces/jwt.payload';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  async signup(@Body() signupUser: SignupDto, @Res() res: Response) {
    try {
      await this.userService.signupUser(signupUser);
      return res.sendStatus(201);
    } catch (error) {
      console.log(error);
      return res.send(error);
    }
  }

  @Post('/login')
  async login(@Body() loginUser: LoginDto, @Res() res: Response) {
    try {
      const token = await this.userService.loginUser(loginUser);
      return res.json({ token: token });
    } catch (error) {
      console.log(error);
      return res.send(error);
    }
  }

  @UseGuards(JwtGuard)
  @Get('/info')
  async userInfo(@Req() req: Request, @Res() res: Response) {
    const { id } = req.user as JwtPayload;
    const info = await this.userService.findById(id);
    return res.json({ name: info.name, email: info.email });
  }
}
