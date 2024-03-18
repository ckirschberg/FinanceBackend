import {
  Controller,
  Post,
  UseGuards,
  Request as Request2,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Post('auth/upgrade')
  upgrade(@Request2() req) {
    // if (this.authService.payViaGateway(information)) {
      return this.authService.upgrade(req.user.id)
    // } else 
    // { 
      // return error message
    // }
    // call a payment gateway and send users credit card
    // if payment is successful, then upgrade, otherwise do not.

    
  }


  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request2() req) {
    return this.authService.login(req.user);
  }
  
  @Post('auth/signup')
  async signup(@Request2() req) {
    // console.log("body", req.body);
    
    return this.authService.signup(req.body);
  }
}
