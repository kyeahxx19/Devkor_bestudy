import { Controller, Get, Post, Delete, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller('/users')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  
  // parameter query
  @Get('/:index')
  getUsernameByIndex(@Param('index') index: number, @Res() res: Response){
    try{
      const username = this.appService.getUsernameByIndex(index);
      res.send(username);
    } catch(error){
      res.status(400).send(error.message);
    }
  }

  @Post('/:name')
  postUsername(@Param('name') name: string, @Res() res: Response){
    try{
      const index = this.appService.postUsername(name);
      res.status(200).send(index);
    } catch(error){
      res.status(500).send(error.message);
    }
  }

  @Delete("/:index")
  deleteUserByIndex(@Param('index') index: number, @Res() res: Response){
    try{
      const username = this.appService.deleteUserByIndex(index);
      res.status(200).send(username);
    } catch(error){
      res.status(400).send(error.message);
    }
  }
}
