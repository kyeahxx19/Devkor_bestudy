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
import { ApiBody, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BasicApiResponse } from 'src/decorators/api.decorator';

@Controller('user')
@ApiTags('user')
@BasicApiResponse()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/signup')
  @ApiBody({ description: 'signup 정보', type: SignupDto })
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
  @ApiBody({ description: 'login 정보', type: LoginDto })
  @ApiResponse({
    description: '성공시 토큰 반환',
    schema: { properties: { token: { type: 'string' } } },
  })
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
  @ApiHeader({
    description: 'access token',
    name: 'Authorization',
    example: 'Bearer $token',
  })
  @ApiResponse({
    description: 'user info',
    schema: {
      properties: { name: { type: 'string' }, email: { type: 'string' } },
    },
  })
  @Get('/info')
  async userInfo(@Req() req: Request, @Res() res: Response) {
    const { id } = req.user as JwtPayload;
    const info = await this.userService.findById(id);
    return res.json({ name: info.name, email: info.email });
  }
}
