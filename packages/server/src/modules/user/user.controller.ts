import { Get, Post, Body, Controller, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { DeleteResult } from 'typeorm'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

import {
  TokenPairResponse,
  AccessTokenResponse,
  UserResponse,
  UserListResponse,
  UserSearchOptionsResponse,
} from './user.vo.js'

import { User } from '../../common/decorator/user.js'

import { UserService } from './user.service.js'
import {
  LoginDTO,
  RegisterDTO,
  RefreshTokenDTO,
  AddUserDTO,
  DeleteUserDTO,
  UpdateUserDTO,
  UpdateMyPasswordDTO,
  UpdateOtherPasswordDTO,
  QueryUserDTO,
} from './user.dto.js'
import {
  TokenPairVO,
  AccessTokenVO,
  UserVO,
  UserListVO,
  UserSearchOptionsVO,
} from './user.vo.js'

// @ApiBearerAuth()
@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '账户登陆' })
  @ApiOkResponse({
    status: 200,
    description: '返回token对',
    type: TokenPairResponse,
  })
  @UseGuards(AuthGuard('local'))
  @Post('/login')
  async login(@Body() loginDTO: LoginDTO): Promise<TokenPairVO> {
    return this.userService.login(loginDTO)
  }

  @ApiOperation({ summary: '账户注册' })
  @ApiOkResponse({
    status: 200,
    description: '返回token对',
    type: TokenPairResponse,
  })
  @UseGuards(AuthGuard('local'))
  @Post('/register')
  async register(@Body() registerDTO: RegisterDTO): Promise<TokenPairVO> {
    return this.userService.register(registerDTO)
  }

  @ApiOperation({ summary: '更新accessToken' })
  @ApiOkResponse({
    status: 200,
    description: '返回新的accessToken',
    type: AccessTokenResponse,
  })
  @Post('/refresh_token')
  async refreshToken(
    @Body() refreshTokenDTO: RefreshTokenDTO,
  ): Promise<AccessTokenVO> {
    return this.userService.refreshToken(refreshTokenDTO)
  }

  @ApiOperation({ summary: '获取用户信息' })
  @ApiOkResponse({
    status: 200,
    description: '返回用户信息',
    type: UserResponse,
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('get_user')
  async getUserInfo(@User() user): Promise<UserVO> {
    return await this.userService.getUser(user)
  }

  @ApiOperation({ summary: '获取全部用户信息列表搜索框下拉列表' })
  @ApiOkResponse({
    status: 200,
    description: '返回全部用户信息列表搜索框下拉列表',
    type: UserSearchOptionsResponse,
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('get_search_options')
  async getSearchOptions(): Promise<UserSearchOptionsVO> {
    return await this.userService.getSearchOptions()
  }

  @ApiOperation({ summary: '获取用户信息列表' })
  @ApiOkResponse({
    status: 200,
    description: '返回所有用户信息列表',
    type: UserListResponse,
  })
  @UseGuards(AuthGuard('jwt'))
  @Post('get_user_list')
  async getUserList(@Body() queryUserDTO: QueryUserDTO): Promise<UserListVO> {
    return await this.userService.getUserList(queryUserDTO)
  }

  @ApiOperation({ summary: '新增用户' })
  @ApiOkResponse({
    status: 200,
    description: '返回用户信息',
    type: UserResponse,
  })
  @UseGuards(AuthGuard('jwt'))
  @Post('add_user')
  async addUser(@User() user, @Body() addUserDTO: AddUserDTO): Promise<UserVO> {
    return await this.userService.addUser(user, addUserDTO)
  }

  @ApiOperation({ summary: '根据用户名删除用户' })
  @ApiOkResponse({
    status: 200,
    description: '用户删除成功',
    type: DeleteResult,
  })
  @UseGuards(AuthGuard('jwt'))
  @Post('delete_user')
  async deteleUser(
    @Body() deleteUserDTO: DeleteUserDTO,
  ): Promise<DeleteResult> {
    return await this.userService.deleteUser(deleteUserDTO)
  }

  @ApiOperation({ summary: '更新用户信息' })
  @ApiOkResponse({
    status: 200,
    description: '返回用户信息',
    type: UserResponse,
  })
  @UseGuards(AuthGuard('jwt'))
  @Post('update_user')
  async updateUserInfo(
    @User() user,
    @Body() updateUserInfoDTO: UpdateUserDTO,
  ): Promise<UserVO> {
    return await this.userService.updateUser(user, updateUserInfoDTO)
  }

  @ApiOperation({ summary: '更新别人的密码' })
  @ApiOkResponse({
    status: 200,
    description: '返回用户信息',
    type: UserResponse,
  })
  @UseGuards(AuthGuard('jwt'))
  @Post('update_other_password')
  async updateOtherPassword(
    @User() user,
    @Body() updateOtherPasswordDTO: UpdateOtherPasswordDTO,
  ): Promise<UserVO> {
    return await this.userService.updateOtherPassword(
      user,
      updateOtherPasswordDTO,
    )
  }

  @ApiOperation({ summary: '更新自己的密码' })
  @ApiOkResponse({
    status: 200,
    description: '返回用户信息',
    type: UserResponse,
  })
  @UseGuards(AuthGuard('jwt'))
  @Post('update_my_password')
  async updateMyPassword(
    @User() user,
    @Body() updateMyPasswordDTO: UpdateMyPasswordDTO,
  ): Promise<UserVO> {
    return await this.userService.updateMyPassword(user, updateMyPasswordDTO)
  }
}
