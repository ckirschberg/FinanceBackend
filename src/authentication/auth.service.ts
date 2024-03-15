import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(user: any) {
    return this.usersService.create(user.username, user.password);
  }

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    // console.log("user found", user);

    if (user && user.password === pass) {
      const { password, ...result } = user;
      // console.log("user found removed password", result);
      
      return result;
    }
    return null;
  }

  async login(user: any) {
    // console.log("user in login auth.service", user);
    
    const payload = { 
      username: user.username, id: user.id
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
