import { Controller, Get, Post, Res, UseGuards, Body, UnauthorizedException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { User } from '@prisma/client';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  @ApiOperation({ 
    summary: 'User login',
    description: 'Login with email and password. Returns user data and access token.'
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful',
    schema: {
      example: {
        user: {
          id: 1,
          email: 'admin@bank.co.ke',
          firstName: 'System',
          lastName: 'Administrator',
          role: 'ADMIN',
          organizationId: 1,
          organization: {
            id: 1,
            name: 'Default Organization',
            domain: 'default.local'
          }
        },
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @UseGuards(LocalAuthGuard)
  async login(
    @Body() loginDto: LoginDto,
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.login(user, response);
  }

  @Post('register')
  @ApiOperation({ 
    summary: 'User registration',
    description: 'Register a new user account. User will be assigned to the default organization with STAFF role.'
  })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Registration successful',
    schema: {
      example: {
        user: {
          id: 1,
          email: 'newuser@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'STAFF',
          organizationId: 1,
          organization: {
            id: 1,
            name: 'Default Organization',
            domain: 'default.local'
          }
        },
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid input or user already exists' })
  async register(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    // Create user in default organization (ID: 1)
    const newUser = await this.usersService.create(createUserDto, 1);
    return await this.authService.login(newUser, response);
  }

  @Post('login/organization')
  @ApiOperation({ 
    summary: 'Login to specific organization',
    description: 'Login with email, password, and organization identifier. Useful for multi-tenant systems where users can belong to multiple organizations.'
  })
  @ApiBody({
    description: 'Login with organization context',
    schema: {
      example: {
        email: 'admin@bank.co.ke',
        password: 'admin123',
        organizationId: 1
      },
      required: ['email', 'password', 'organizationId'],
      properties: {
        email: {
          type: 'string',
          description: 'User email address',
          example: 'admin@bank.co.ke'
        },
        password: {
          type: 'string',
          description: 'User password',
          example: 'admin123'
        },
        organizationId: {
          type: 'integer',
          description: 'Organization ID to login to',
          example: 1
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful',
    schema: {
      example: {
        user: {
          id: 1,
          email: 'admin@bank.co.ke',
          firstName: 'System',
          lastName: 'Administrator',
          role: 'ADMIN',
          organizationId: 1,
          organization: {
            id: 1,
            name: 'Default Organization',
            domain: 'default.local'
          }
        },
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials or organization access denied' })
  @ApiResponse({ status: 404, description: 'Organization not found' })
  async loginWithOrganization(
    @Body() loginDto: { email: string; password: string; organizationId: number },
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.verifyUser(loginDto.email, loginDto.password, loginDto.organizationId);
    return await this.authService.login(user, response);
  }

  @Post('login/domain')
  @ApiOperation({ 
    summary: 'Login by organization domain',
    description: 'Login using organization domain/subdomain. Useful for subdomain-based multi-tenancy (e.g., equitybank.com, bankofkenya.com).'
  })
  @ApiBody({
    description: 'Login with organization domain',
    schema: {
      example: {
        email: 'admin@bank.co.ke',
        password: 'admin123',
        domain: 'default.local'
      },
      required: ['email', 'password', 'domain'],
      properties: {
        email: {
          type: 'string',
          description: 'User email address',
          example: 'admin@bank.co.ke'
        },
        password: {
          type: 'string',
          description: 'User password',
          example: 'admin123'
        },
        domain: {
          type: 'string',
          description: 'Organization domain',
          example: 'default.local'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful',
    schema: {
      example: {
        user: {
          id: 1,
          email: 'admin@bank.co.ke',
          firstName: 'System',
          lastName: 'Administrator',
          role: 'ADMIN',
          organizationId: 1,
          organization: {
            id: 1,
            name: 'Default Organization',
            domain: 'default.local'
          }
        },
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 404, description: 'Organization domain not found' })
  async loginWithDomain(
    @Body() loginDto: { email: string; password: string; domain: string },
    @Res({ passthrough: true }) response: Response,
  ) {
    // Find organization by domain
    const organization = await this.authService.findOrganizationByDomain(loginDto.domain);
    if (!organization) {
      throw new UnauthorizedException('Organization domain not found');
    }
    
    const user = await this.authService.verifyUser(loginDto.email, loginDto.password, organization.id);
    return await this.authService.login(user, response);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  @UseGuards(JwtRefreshAuthGuard)
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    return await this.authService.login(user, response);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({ status: 200, description: 'Current user data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(@CurrentUser() user: User) {
    const { password, refreshToken, ...userWithoutSensitiveData } = user;
    return userWithoutSensitiveData;
  }

  @Get('google')
  @ApiOperation({ summary: 'Google OAuth login' })
  @ApiResponse({ status: 302, description: 'Redirect to Google OAuth' })
  @UseGuards(GoogleAuthGuard)
  loginGoogle() {}

  @Get('google/callback')
  @ApiOperation({ summary: 'Google OAuth callback' })
  @ApiResponse({ status: 200, description: 'Google login successful' })
  @ApiResponse({ status: 401, description: 'Google authentication failed' })
  @UseGuards(GoogleAuthGuard)
  async googleCallBack(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response, true);
  }
}
