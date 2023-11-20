import {
  IsNotEmpty,
  IsString,
  IsEmail,
  Length,
  IsOptional,
  IsInt,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { TablePaginationType } from '../../common/type/index.js'

import { RoleType, AccountStatusType } from './user.entity.js'

export class LoginDTO {
  @ApiProperty({
    description: '用户名',
    example: 'andy',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 20)
  readonly username: string

  @ApiProperty({
    description: '密码',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  @Length(6)
  readonly password: string
}

export class RegisterDTO {
  @ApiProperty({
    description: '用户名',
    example: 'andy',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 20)
  readonly username: string

  @ApiProperty({
    description: '密码',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  @Length(6)
  readonly password: string

  @ApiProperty({
    description: '邮箱',
    example: '123456@qq.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string

  @ApiProperty({
    description: '邀请码',
    example: '48454dwesfwfwe451fc54wse15',
  })
  @IsString()
  @IsNotEmpty()
  readonly invitationCode: string
}

export class RefreshTokenDTO {
  @ApiProperty({
    description: 'refreshToken',
    example: '12345678952225626sjkdwodjsw',
  })
  @IsString()
  @IsNotEmpty()
  readonly refreshToken: string
}

export class AddUserDTO {
  @ApiProperty({
    description: '用户名',
    example: 'andy',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 20)
  username: string

  @ApiProperty({
    description: '密码',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  @Length(6)
  password: string

  @ApiProperty({
    description: '邮箱',
    example: '123456@qq.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string

  @ApiProperty({
    description: '角色',
    example: 'user',
  })
  @IsString()
  @IsNotEmpty()
  role: RoleType
}

export class DeleteUserDTO {
  @ApiProperty({
    description: '用户名',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 20)
  username: string
}

export class UpdateUserDTO {
  @ApiProperty({
    description: '用户id',
    example: 'c7aecb6a-0c49-4617-bdfb-751ec76d40f3',
  })
  @IsString()
  @IsNotEmpty()
  userId: string

  @ApiProperty({
    description: '用户名',
    example: '123456',
  })
  @IsOptional()
  @IsString()
  username: string

  @ApiProperty({
    description: '邮箱',
    example: '123456@qq.com',
  })
  @IsOptional()
  @IsString()
  @IsEmail()
  email: string

  @ApiProperty({
    description: '角色',
    example: 'user',
  })
  @IsOptional()
  @IsString()
  role: RoleType

  @ApiProperty({
    description: '账户状态',
    example: 'normal',
  })
  @IsOptional()
  @IsString()
  account_status: AccountStatusType
}

export class UpdateMyPasswordDTO {
  @ApiProperty({
    description: '原密码',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  @Length(6)
  oldPassword: string

  @ApiProperty({
    description: '密码',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  @Length(6)
  password: string
}

export class UpdateOtherPasswordDTO {
  @ApiProperty({
    description: '用户id',
    example: 'c7aecb6a-0c49-4617-bdfb-751ec76d40f3',
  })
  @IsString()
  @IsNotEmpty()
  userId: string

  @ApiProperty({
    description: '密码',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  @Length(6)
  password: string
}

export class QueryUserDTO extends TablePaginationType {
  @ApiPropertyOptional({
    description: '用户名',
    example: 'andy',
  })
  @IsOptional()
  @IsString()
  username?: string

  @ApiPropertyOptional({
    description: '邮箱',
    example: '123456@qq.com',
  })
  @IsOptional()
  @IsString()
  email?: string

  @ApiPropertyOptional({
    description: '角色',
    example: 'user',
  })
  @IsOptional()
  @IsString()
  role?: RoleType

  @ApiPropertyOptional({
    description: '账号状态',
    example: 'normal',
  })
  @IsOptional()
  @IsString()
  account_status?: AccountStatusType

  @ApiPropertyOptional({
    description: '创建时间',
    example: '',
  })
  @IsOptional()
  @IsInt({ each: true })
  create_time?: string

  @ApiPropertyOptional({
    description: '创建人',
    example: 'admin',
  })
  @IsOptional()
  @IsString()
  creator?: string
}
