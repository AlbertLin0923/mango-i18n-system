import { ApiProperty } from '@nestjs/swagger';
import { BaseOkResponse } from '../../common/type';
import { RoleType, AccountStatusType } from './user.entity';

export class TokenPairVO {
  @ApiProperty({
    description: 'accessToken',
    example: '123456789anxuiani1121231',
  })
  accessToken: string;

  @ApiProperty({
    description: 'refreshToken',
    example: '123456789anxuianiaiuhza9jsioa',
  })
  refreshToken: string;
}

export class TokenPairResponse extends BaseOkResponse {
  @ApiProperty({
    description: '返回数据',
    type: () => TokenPairVO,
  })
  data: TokenPairVO;
}

export class AccessTokenVO {
  @ApiProperty({
    description: 'accessToken',
    example: '123456789anxuianiaiuhza9jsioa',
  })
  accessToken: string;
}

export class AccessTokenResponse extends BaseOkResponse {
  @ApiProperty({
    description: '返回数据',
    type: () => AccessTokenVO,
  })
  data: AccessTokenVO;
}

export class User {
  @ApiProperty({
    description: '用户id',
    example: 'c7aecb6a-0c49-4617-bdfb-751ec76d40f3',
  })
  userId: string;

  @ApiProperty({
    description: '用户名',
    example: '123456',
  })
  username: string;

  @ApiProperty({
    description: '邮箱',
    example: '123456@123.com',
  })
  email: string;

  @ApiProperty({
    description: '角色',
    example: 'user',
  })
  role: RoleType;

  @ApiProperty({
    description: '账户状态',
    example: 'normal',
  })
  account_status: AccountStatusType;

  @ApiProperty({
    description: '账号创建时间',
    example: 1638516021090,
  })
  create_time: number;

  @ApiProperty({
    description: '账号创建人',
    example: 'andy',
  })
  creator: string;
}

export class UserVO {
  @ApiProperty({
    description: '用户信息',
    type: User,
  })
  user: User;
}

export class UserResponse extends BaseOkResponse {
  @ApiProperty({
    description: '返回数据',
    type: UserVO,
  })
  data: UserVO;
}

export class UserListVO {
  @ApiProperty({
    description: '用户信息列表',
    isArray: true,
    type: User,
  })
  list: User[];

  @ApiProperty({
    description: '用户列表总数量',
    example: 1000,
  })
  total: number;
}

export class UserListResponse extends BaseOkResponse {
  @ApiProperty({
    description: '返回数据',
    type: UserListVO,
  })
  data: UserListVO;
}

export class UserSearchOptionsVO {
  @ApiProperty({
    description: '用户角色下拉列表',
    example: [],
  })
  roleMap: Array<{ label: string; value: RoleType }>;

  @ApiProperty({
    description: '用户账号状态下拉列表',
    example: [],
  })
  accountStatusMap: Array<{
    label: string;
    value: AccountStatusType;
  }>;
}

export class UserSearchOptionsResponse extends BaseOkResponse {
  @ApiProperty({
    description: '返回数据',
    type: UserSearchOptionsVO,
  })
  data: UserSearchOptionsVO;
}
