import {
  Controller,
  UseGuards,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { BasicApiResponse } from 'src/decorators/api.decorator';
import { NewPostDto, PostDto, PostListDto } from 'src/entities/dtos/post.dto';
import { JwtGuard } from 'src/guard/jwt.guard';
import { PostService } from './post.service';

@Controller('posts')
@ApiTags('posts')
@BasicApiResponse()
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtGuard)
  @Get()
  @ApiHeader({
    description: 'access token',
    name: 'Authorization',
    example: 'Bearer $token',
  })
  @ApiResponse({
    description: '게시글 리스트',
    type: PostListDto,
    isArray: true,
  })
  async getPostList(@Query('page') page: number = 1, @Res() res: Response) {
    try {
      const posts = await this.postService.getPostList(page);
      return res.json(posts);
    } catch (error) {
      console.log(error);
      return res.status(error.statusCode).json({ message: error.message });
    }
  }

  @UseGuards(JwtGuard)
  @Get('/:id')
  @ApiHeader({
    description: 'access token',
    name: 'Authorization',
    example: 'Bearer $token',
  })
  @ApiParam({ description: '게시글 id', name: 'id', type: 'number' })
  @ApiResponse({ description: '게시글 내용', type: PostDto })
  async getPost(@Param('id') id: number, @Res() res: Response) {
    try {
      const post = await this.postService.getPostById(id);
      return res.json(post);
    } catch (error) {
      console.log(error);
      return res.status(error.status).json({ message: error.message });
    }
  }

  @UseGuards(JwtGuard)
  @Post()
  @ApiHeader({
    description: 'access token',
    name: 'Authorization',
    example: 'Bearer $token',
  })
  @ApiBody({ description: '게시글 내용', type: NewPostDto })
  @ApiResponse({ description: '게시글 내용', type: PostDto })
  async createPost(
    @Req() req: Request,
    @Body() postDto: NewPostDto,
    @Res() res: Response,
  ) {
    try {
      const { id } = req.user;
      const newPost = await this.postService.createPost(id, postDto);
      return res.status(201).json(newPost);
    } catch (error) {
      console.log(error);
      return res.status(error.statusCode).json({ message: error.message });
    }
  }

  @UseGuards(JwtGuard)
  @Put('/:postId')
  @ApiHeader({
    description: 'access token',
    name: 'Authorization',
    example: 'Bearer $token',
  })
  @ApiBody({ description: '게시글 내용', type: NewPostDto })
  @ApiResponse({ description: '게시글 내용', type: PostDto })
  async updatePost(
    @Req() req: Request,
    @Param('postId') postId: number,
    @Body() postDto: NewPostDto,
    @Res() res: Response,
  ) {
    try {
      const { id } = req.user;
      const updatedPost = await this.postService.updatePost(
        id,
        postId,
        postDto,
      );
      return res.status(201).json(updatedPost);
    } catch (error) {
      console.log(error);
      return res.status(error.statusCode).json({ message: error.message });
    }
  }

  @UseGuards(JwtGuard)
  @Delete('/:postId')
  @ApiHeader({
    description: 'access token',
    name: 'Authorization',
    example: 'Bearer $token',
  })
  @ApiParam({ description: '게시글 id', name: 'postId', type: 'number' })
  @ApiResponse({ description: '삭제 성공시 204 반환' })
  async deletePost(
    @Req() req: Request,
    @Param('postId') postId: number,
    @Res() res: Response,
  ) {
    try {
      const { id } = req.user;
      await this.postService.deletePost(id, postId);
      return res.sendStatus(204);
    } catch (error) {
      console.log(error);
      return res.status(error.statusCode).json({ message: error.message });
    }
  }
}
