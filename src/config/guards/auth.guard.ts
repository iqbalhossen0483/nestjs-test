import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { jwtPayload } from '../../auth/auth.service';
import { config } from '../config';

interface payload extends jwtPayload {
  sub: string;
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends Request {
  user?: payload;
}

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    try {
      const request = context.switchToHttp().getRequest<AuthRequest>();

      const authHeader = request.headers.authorization;
      const cookieToken = request.cookies?.token as string;

      let token: string | undefined;

      if (authHeader) {
        const [type, headerToken] = authHeader.split(' ');
        if (type === 'Bearer' && headerToken) {
          token = headerToken;
        }
      } else if (cookieToken) {
        token = cookieToken;
      }

      if (!token) {
        throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
      }

      const decoded = jwt.verify(token, config.jwtSecret) as payload;

      request.user = decoded;
      return true;
    } catch {
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
