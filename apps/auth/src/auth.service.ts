import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UserDocument } from './users/models/user.schema';
import { TokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly configServer: ConfigService,
    private readonly jwtService: JwtService
  ) { }

  async login(user: UserDocument, response: Response) {
    const payload: TokenPayload = { userId: user._id.toHexString() };
    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configServer.get('JWT_EXPIRATION_TIME')
    );
    const token = this.jwtService.sign(payload);
    response.cookie('Authentication', token, { httpOnly: true, expires });
  }
}
