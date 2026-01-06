import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  create(createAuthDto: CreateUserDto) {
    const newUser = new this.userModel(createAuthDto);
    return newUser.save();
  }

  findAll() {
    return this.userModel.find().exec();
  }

  findOne(id: string) {
    return this.userModel.findById(id).exec();
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const newUser = this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });
    return newUser;
  }

  remove(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }
}
