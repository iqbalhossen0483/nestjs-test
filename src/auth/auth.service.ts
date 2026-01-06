import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Model, Types } from 'mongoose';
import { config } from '../config/config';
import { User, UserDocument } from '../user/entities/user.entity';
import { LoginAuthDto } from './dto/login-auth.dto';
import { RegisterAuthDto } from './dto/register-auth.dto';

type jwtPayload = {
  _id: Types.ObjectId;
  email: string;
  role: string;
};

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  private async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  private generateToken({ _id, email, role }: jwtPayload): string {
    const payload = { _id, email, role };
    const token = jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpire,
    });

    return token;
  }

  private decodeToken(token: string): jwtPayload {
    const decoded = jwt.verify(token, config.jwtSecret);
    return decoded as jwtPayload;
  }

  private setCookie(token: string) {
    return `Authorization=${token}; HttpOnly; Path=/; Max-Age=${config.jwtExpire}`;
  }

  async register(registerAuthDto: RegisterAuthDto) {
    // check if user with the same email already exists
    const existingUser = await this.userModel
      .findOne({ email: registerAuthDto.email })
      .exec();
    if (existingUser) {
      return {
        success: false,
        message: 'User with this email already exists',
      };
    }

    // check password and confirmPassword match
    if (registerAuthDto.password !== registerAuthDto.confirmPassword) {
      return { success: false, message: 'Passwords do not match' };
    }

    // Hash password before saving
    registerAuthDto.password = await this.hashPassword(
      registerAuthDto.password,
    );

    delete registerAuthDto.confirmPassword;

    const newUser = new this.userModel(registerAuthDto);
    const user = await newUser.save();
    const token = this.generateToken({
      _id: user._id,
      email: user.email,
      role: user.role,
    });
    return { success: true, message: 'User registered successfully', token };
  }

  async login(loginAuthDto: LoginAuthDto) {
    const { email, password } = loginAuthDto;

    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      return { success: false, message: 'Invalid email or password' };
    }
    const isPasswordValid = await this.comparePassword(
      password as string,
      user.password,
    );
    if (!isPasswordValid) {
      return { success: false, message: 'Invalid email or password' };
    }

    const token = this.generateToken({
      _id: user._id,
      email: user.email,
      role: user.role,
    });

    return { success: true, message: 'Login successful', token };
  }

  getProfile() {
    const token = ''; // Placeholder for token retrieval logic
    const decoded = this.decodeToken(token);
    const user = this.userModel.findById(decoded._id).exec();
    return user;
  }
}
