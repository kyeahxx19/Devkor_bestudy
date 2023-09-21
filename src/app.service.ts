import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  usernames: string[];
  constructor(){
    this.usernames = ['노정훈', '권예진', '이정원'];
  }

  getHello(): string {
    return 'Hello World!';
  }

  getUsernameByIndex(index: number){
    if (index < 0 || index > this.usernames.length){
      throw Error('Index out of range');
    }
    return this.usernames[index];
  }

  postUsername(name: string){
    try{
      this.usernames.push(name);
      return this.usernames.length - 1;
    } catch(error){
      return error;
    }
  }

  deleteUserByIndex(index: number){
    if (index < 0 || index > this.usernames.length){
      throw Error('Index out of range');
    }
    const username = this.usernames[index];
    this.usernames.splice(index, 1);
    return username;
  }
}
