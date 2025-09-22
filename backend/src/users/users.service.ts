import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserRole } from '@prisma/client';
import { hash } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto): Promise<User> {
    const hashedPassword = await hash(data.password, 10);
    
    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      include: {
        branch: true,
      },
    });
  }

  async findById(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        branch: true,
      },
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        branch: true,
      },
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      include: {
        branch: true,
      },
    });
  }

  async update(id: number, data: UpdateUserDto): Promise<User> {
    const updateData: any = { ...data };
    
    if (data.password) {
      updateData.password = await hash(data.password, 10);
    }
    
    return this.prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        branch: true,
      },
    });
  }

  async delete(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async getOrCreateUser(data: CreateUserDto): Promise<User> {
    const existingUser = await this.findByEmail(data.email);
    if (existingUser) {
      return existingUser;
    }
    return this.create(data);
  }

  async getBranches() {
    return this.prisma.branch.findMany({
      include: {
        manager: true,
        users: true,
      },
    });
  }

  async createBranch(data: { name: string; region: string; managerId?: number }) {
    return this.prisma.branch.create({
      data,
      include: {
        manager: true,
        users: true,
      },
    });
  }
}
