import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class SignupDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '이름', type: String })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: '이메일', type: String })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '비밀번호', type: String })
  password: string;
}

export class LoginDto extends PickType(SignupDto, [
  'email',
  'password',
] as const) {}
