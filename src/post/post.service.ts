import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Posts, Users } from 'src/entities';
import { NewPostDto, PostDto, PostListDto } from 'src/entities/dtos/post.dto';
import { Repository } from 'typeorm';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Posts)
    private readonly postRepo: Repository<Posts>,
  ) {}

  async getPostList(page: number = 1) {
    const take = 5;
    const [posts, total] = await this.postRepo.findAndCount({
      take: take,
      skip: (page - 1) * take,
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });

    return {
      posts: posts.map((post) => PostListDto.ToDto(post)),
      meta: { total: total, page: page, lastPage: Math.ceil(total / take) },
    };
  }

  async getPostById(id: number): Promise<PostDto> {
    const post = await this.postRepo.findOne({
      where: { id: id },
      relations: ['user'],
    });
    if (!post) {
      throw new HttpException('not found', 404);
    }
    post.views += 1;
    const updatedPost = await this.postRepo.save(post);

    return PostDto.ToDto(updatedPost);
  }

  async createPost(userId: number, postDto: NewPostDto) {
    const { title, content } = postDto;
    const newPost = await this.postRepo.create({
      title: title,
      content: content,
      views: 0,
      createdAt: new Date(new Date().getTime() + 9 * 60 * 60 * 1000),
      user: { id: userId } as Users,
    });
    await this.postRepo.save(newPost);

    return PostDto.ToDto(newPost);
  }

  async updatePost(userId: number, id: number, postDto: NewPostDto) {
    const post = await this.postRepo.findOne({
      where: { id: id },
      relations: ['user'],
    });
    if (post.user.id !== userId) {
      throw new HttpException('Forbidden', 403);
    }

    const { title, content } = postDto;
    post.title = title;
    post.content = content;
    const updatedPost = await this.postRepo.save(post);

    return PostDto.ToDto(updatedPost);
  }

  async deletePost(userId: number, id: number) {
    const post = await this.postRepo.findOne({
      where: { id: id },
      relations: ['user'],
    });
    if (post.user.id !== userId) {
      throw new HttpException('Forbidden', 403);
    }

    await this.postRepo.delete({ id: id });
    return true;
  }
}
