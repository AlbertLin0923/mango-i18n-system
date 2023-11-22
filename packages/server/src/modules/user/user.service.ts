import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { UserEntity } from './user.entity.js'

import { BusinessException } from '../../common/exception/business.exception.js'
import {
  filterObjProperties,
  hashPassword,
  createQueryParams,
} from '../../common/utils/index.js'

import { accountStatusMap, roleMap } from './user.dict.js'

import {
  LoginDTO,
  RegisterDTO,
  RefreshTokenDTO,
  UpdateMyUserInfoDTO,
  AddUserDTO,
  DeleteUserDTO,
  UpdateMyPasswordDTO,
  UpdateOtherUserInfoDTO,
  UpdateOtherPasswordDTO,
  QueryUserDTO,
} from './user.dto.js'
import {
  TokenPairVO,
  AccessTokenVO,
  User,
  UserVO,
  UserListVO,
  UserSearchOptionsVO,
} from './user.vo.js'
import { JwtService } from '@nestjs/jwt'
import { Repository, DeleteResult } from 'typeorm'
import { ConfigService } from '@nestjs/config'
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(loginDTO: LoginDTO): Promise<TokenPairVO> {
    const { username, password } = loginDTO
    const hashedPassword = hashPassword(
      password,
      this.configService.get<string>('PASSWORD_SALT'),
    )
    const user = await this.userRepository.findOneBy({
      username,
      password: hashedPassword,
    })
    if (!user) {
      throw new BusinessException('用户名或者密码错误', 500)
    }

    if (user.account_status === 'freeze') {
      throw new BusinessException('账户已被冻结，请联系管理员', 403)
    }
    return this.generateTokenPair({
      userId: user.userId,
    })
  }

  async register(registerDTO: RegisterDTO): Promise<TokenPairVO> {
    const { username, password, email, invitationCode } = registerDTO

    if (invitationCode !== this.configService.get<string>('INVITATION_CODE')) {
      throw new BusinessException('邀请码不正确', 500)
    }

    const isHave = await this.userRepository.findBy({ username })

    if (isHave.length) {
      throw new BusinessException('用户名重复', 500)
    }

    const hashedPassword = hashPassword(
      password,
      this.configService.get<string>('PASSWORD_SALT'),
    )

    const newUser = await this.userRepository.save(
      Object.assign(new UserEntity(), {
        username,
        password: hashedPassword,
        email,
        account_status: 'normal',
        role: 'admin',
        creator: 'from register page',
      }),
    )

    return this.generateTokenPair({
      userId: newUser.userId,
    })
  }

  async refreshToken(refreshTokenDTO: RefreshTokenDTO): Promise<AccessTokenVO> {
    const { refreshToken } = refreshTokenDTO
    try {
      const { userId } = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      })

      const accessToken = this.generateAccessToken({
        userId,
      })
      return { accessToken }
    } catch (e) {
      throw new UnauthorizedException()
    }
  }

  async getUserInfo(user): Promise<UserVO> {
    const _user = await this.userRepository.findOneBy({ userId: user.userId })

    return this.buildUserVO(_user)
  }

  async updateMyUserInfo(
    user,
    updateMyUserInfoDTO: UpdateMyUserInfoDTO,
  ): Promise<UserVO> {
    const oldUserInfo = await this.userRepository.findOneBy({
      userId: user.userId,
    })

    const newUserInfo = await this.userRepository.save(
      Object.assign(oldUserInfo, updateMyUserInfoDTO),
    )
    return this.buildUserVO(newUserInfo)
  }

  async getSearchOptions(): Promise<UserSearchOptionsVO> {
    return { roleMap, accountStatusMap }
  }

  async getUserList({
    pageSize = 10,
    page = 1,
    username,
    email,
    role,
    account_status,
    create_time,
    creator,
  }: QueryUserDTO): Promise<UserListVO> {
    const sql = createQueryParams(
      {
        username,
        email,
        role,
        account_status,
        create_time,
        creator,
      },
      'user',
      'create_time',
    )

    console.log('sql', sql)

    const data: [UserEntity[], number] = await this.userRepository
      .createQueryBuilder('user')
      .where(sql[0], sql[1])
      .orderBy('user.create_time', 'DESC')
      .skip(pageSize * (page - 1))
      .take(pageSize)
      .getManyAndCount()

    return { list: data[0], total: data[1] }
  }

  async addUser(user, addUserDTO: AddUserDTO): Promise<UserVO> {
    const { username, password, email, role } = addUserDTO

    const isHave = await this.userRepository.findBy({ username })
    if (isHave.length) {
      throw new BusinessException('用户名重复', 500)
    }

    const hashedPassword = hashPassword(
      password,
      this.configService.get<string>('PASSWORD_SALT'),
    )

    const newUser = await this.userRepository.save(
      Object.assign(new UserEntity(), {
        username,
        password: hashedPassword,
        email,
        account_status: 'normal',
        role,
        creator: user.username,
      }),
    )

    return this.buildUserVO(newUser)
  }

  async updateOtherUserInfo(
    user,
    updateOtherUserInfoDTO: UpdateOtherUserInfoDTO,
  ): Promise<UserVO> {
    const actionUser = await this.userRepository.findOneBy({
      userId: user.userId,
    })

    if (!(actionUser.role === 'admin')) {
      throw new BusinessException('该用户无权限进行该操作')
    }

    const oldUserInfo = await this.userRepository.findOneBy({
      userId: updateOtherUserInfoDTO.userId,
    })

    if (!oldUserInfo) {
      throw new BusinessException('找不到该用户')
    }

    if (actionUser.userId === updateOtherUserInfoDTO.userId) {
      throw new BusinessException('用户不能修改本用户信息')
    }

    const newUserInfo = await this.userRepository.save(
      Object.assign(oldUserInfo, updateOtherUserInfoDTO),
    )
    return this.buildUserVO(newUserInfo)
  }

  async deleteUser(deleteUserDTO: DeleteUserDTO): Promise<DeleteResult> {
    return await this.userRepository.delete(deleteUserDTO)
  }

  async updateMyPassword(
    user,
    updateMyPasswordDTO: UpdateMyPasswordDTO,
  ): Promise<UserVO> {
    const { oldPassword, password } = updateMyPasswordDTO

    const { userId } = user

    const toUpdateUser = await this.userRepository
      .createQueryBuilder('user')
      .where('user.userId = :userId', { userId })
      .addSelect('user.password')
      .getOne()

    if (!toUpdateUser) {
      throw new BusinessException('找不到该用户')
    }

    if (
      toUpdateUser.password !==
      hashPassword(oldPassword, this.configService.get<string>('PASSWORD_SALT'))
    ) {
      throw new BusinessException('原密码错误')
    }

    const updated = Object.assign(toUpdateUser, {
      password: hashPassword(
        password,
        this.configService.get<string>('PASSWORD_SALT'),
      ),
    })

    const _user = await this.userRepository.save(updated)
    return this.buildUserVO(_user)
  }

  async updateOtherPassword(
    user,
    updateOtherPasswordDTO: UpdateOtherPasswordDTO,
  ): Promise<UserVO> {
    const { userId, password } = updateOtherPasswordDTO

    const actionUser = await this.userRepository.findOneBy({
      userId: user.userId,
    })
    if (!(actionUser.role === 'admin')) {
      throw new BusinessException('该用户无权限进行该操作')
    }

    const toUpdateUser = await this.userRepository.findOneBy({
      userId,
    })

    if (!toUpdateUser) {
      throw new BusinessException('找不到该用户')
    }

    if (actionUser.userId === userId) {
      throw new BusinessException('用户不能修改本用户信息')
    }

    const updated = Object.assign(toUpdateUser, {
      password: hashPassword(
        password,
        this.configService.get<string>('PASSWORD_SALT'),
      ),
    })

    const _user = await this.userRepository.save(updated)
    return this.buildUserVO(_user)
  }

  private generateTokenPair(payload: { userId: string }): TokenPairVO {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    }
  }

  private generateAccessToken(payload: { userId: string }): string {
    return this.jwtService.sign(payload)
  }

  private generateRefreshToken(payload: { userId: string }): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_IN'),
    })
  }

  private buildUserVO(user: UserEntity): UserVO {
    return { user: filterObjProperties(user, ['password']) as User }
  }
}
