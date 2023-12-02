import { Type } from 'class-transformer';
import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Posts } from '../post.entity';

export class PostDto {
  @IsNumber()
  @ApiProperty({ description: '게시글 ID', type: Number })
  id: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '제목', type: String })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '내용', type: String })
  content: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: '조회수', type: Number })
  views: number;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  @ApiProperty({ description: '일자', type: Date })
  createdAt: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '작성자', type: String })
  user: string;

  static ToDto(post: Posts): PostDto {
    return {
      id: post.id,
      title: post.title,
      content: post.content,
      views: post.views,
      createdAt: post.createdAt,
      user: post.user.name,
    };
  }
}

export class NewPostDto extends PickType(PostDto, [
  'title',
  'content',
] as const) {}

export class PostListDto extends OmitType(PostDto, [
  'content',
  'user',
] as const) {
  static ToDto(post: Posts): PostListDto {
    return {
      id: post.id,
      title: post.title,
      views: post.views,
      createdAt: post.createdAt,
    };
  }
}
