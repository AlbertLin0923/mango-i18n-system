import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';

import { JwtService } from '@nestjs/jwt';

import { BusinessException } from '../../common/exception/business.exception';
import {
  filterObjProperties,
  hashPassword,
  createQueryParams,
} from '../../common/utils';

import { UserEntity, RoleType, AccountStatusType } from './user.entity';
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
} from './user.dto';

import {
  TokenPairVO,
  AccessTokenVO,
  User,
  UserVO,
  UserListVO,
  UserSearchOptionsVO,
} from './user.vo';

import CONFIG from '../../common/config';
const jwtSecurity = CONFIG.get('jwtSecurity');
const passwordSalt = CONFIG.get('passwordSalt');
const registerKey = CONFIG.get('registerKey');

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDTO: LoginDTO): Promise<TokenPairVO> {
    const { username, password } = loginDTO;
    const hashedPassword = hashPassword(password, passwordSalt);
    const user = await this.userRepository.findOne({
      username,
      password: hashedPassword,
    });
    if (!user) {
      throw new BusinessException('用户名或者密码错误', 500);
    }

    if (user.account_status === 'freeze') {
      throw new BusinessException('账户已被冻结，请联系管理员', 403);
    }
    return this.generateTokenPair({
      userId: user.userId,
    });
  }

  async register(registerDTO: RegisterDTO): Promise<TokenPairVO> {
    const { username, password, email, key } = registerDTO;

    console.log('username', username);

    if (key !== registerKey) {
      throw new BusinessException('注册密钥不正确', 500);
    }

    const isHave = await this.userRepository.find({ username });

    if (isHave.length) {
      throw new BusinessException('用户名重复', 500);
    }

    const hashedPassword = hashPassword(password, passwordSalt);

    const newUser = await this.userRepository.save(
      Object.assign(new UserEntity(), {
        username,
        password: hashedPassword,
        email,
        account_status: 'normal',
        role: 'admin',
        creator: 'from register page',
      }),
    );

    console.log('newUser', newUser);

    return this.generateTokenPair({
      userId: newUser.userId,
    });
  }

  async refreshToken(refreshTokenDTO: RefreshTokenDTO): Promise<AccessTokenVO> {
    const { refreshToken } = refreshTokenDTO;
    try {
      const { userId } = this.jwtService.verify(refreshToken, {
        secret: jwtSecurity.jwtRefreshSecret,
      });

      const accessToken = this.generateAccessToken({
        userId,
      });
      return { accessToken };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async getUser(user): Promise<UserVO> {
    const _user = await this.userRepository.findOne({ userId: user.userId });

    return this.buildUserVO(_user);
  }

  async getSearchOptions(): Promise<UserSearchOptionsVO> {
    const roleMap: Array<{ label: string; value: RoleType }> = [
      {
        label: '普通用户',
        value: 'user',
      },
      {
        label: '管理员',
        value: 'admin',
      },
    ];

    const accountStatusMap: Array<{
      label: string;
      value: AccountStatusType;
    }> = [
      {
        label: '账户正常',
        value: 'normal',
      },
      {
        label: '账户冻结',
        value: 'freeze',
      },
    ];

    return { roleMap, accountStatusMap };
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
    );

    console.log('sql', sql);

    const data: [UserEntity[], number] = await this.userRepository
      .createQueryBuilder('user')
      .where(sql[0], sql[1])
      .orderBy('user.create_time', 'DESC')
      .skip(pageSize * (page - 1))
      .take(pageSize)
      .getManyAndCount();

    return { list: data[0], total: data[1] };
  }

  async addUser(user, addUserDTO: AddUserDTO): Promise<UserVO> {
    const { username, password, email, role } = addUserDTO;

    const isHave = await this.userRepository.find({ username });
    if (isHave.length) {
      throw new BusinessException('用户名重复', 500);
    }

    const hashedPassword = hashPassword(password, passwordSalt);

    const newUser = await this.userRepository.save(
      Object.assign(new UserEntity(), {
        username,
        password: hashedPassword,
        email,
        account_status: 'normal',
        role,
        creator: user.username,
      }),
    );

    return this.buildUserVO(newUser);
  }

  async deleteUser(deleteUserDTO: DeleteUserDTO): Promise<DeleteResult> {
    return await this.userRepository.delete(deleteUserDTO);
  }

  async updateUser(user, updateUserDTO: UpdateUserDTO): Promise<UserVO> {
    const actionUser = await this.userRepository.findOne({
      userId: user.userId,
    });

    if (!(actionUser.role === 'admin')) {
      throw new BusinessException('该用户无权限进行该操作');
    }

    const toUpdateUser = await this.userRepository.findOne({
      userId: updateUserDTO.userId,
    });

    if (!toUpdateUser) {
      throw new BusinessException('找不到该用户');
    }

    if (actionUser.userId === updateUserDTO.userId) {
      throw new BusinessException('用户不能修改本用户信息');
    }

    const updated = Object.assign(toUpdateUser, updateUserDTO);
    const _user = await this.userRepository.save(updated);
    return this.buildUserVO(_user);
  }

  async updateMyPassword(
    user,
    updateMyPasswordDTO: UpdateMyPasswordDTO,
  ): Promise<UserVO> {
    const { oldPassword, password } = updateMyPasswordDTO;

    const { userId } = user;

    const toUpdateUser = await this.userRepository
      .createQueryBuilder('user')
      .where('user.userId = :userId', { userId })
      .addSelect('user.password')
      .getOne();

    if (!toUpdateUser) {
      throw new BusinessException('找不到该用户');
    }

    if (toUpdateUser.password !== hashPassword(oldPassword, passwordSalt)) {
      throw new BusinessException('原密码错误');
    }

    const updated = Object.assign(toUpdateUser, {
      password: hashPassword(password, passwordSalt),
    });

    const _user = await this.userRepository.save(updated);
    return this.buildUserVO(_user);
  }

  async updateOtherPassword(
    user,
    updateOtherPasswordDTO: UpdateOtherPasswordDTO,
  ): Promise<UserVO> {
    const { userId, password } = updateOtherPasswordDTO;

    const actionUser = await this.userRepository.findOne({
      userId: user.userId,
    });
    if (!(actionUser.role === 'admin')) {
      throw new BusinessException('该用户无权限进行该操作');
    }

    const toUpdateUser = await this.userRepository.findOne({
      userId,
    });

    if (!toUpdateUser) {
      throw new BusinessException('找不到该用户');
    }

    if (actionUser.userId === userId) {
      throw new BusinessException('用户不能修改本用户信息');
    }

    const updated = Object.assign(toUpdateUser, {
      password: hashPassword(password, passwordSalt),
    });

    const _user = await this.userRepository.save(updated);
    return this.buildUserVO(_user);
  }

  private generateTokenPair(payload: { userId: string }): TokenPairVO {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: { userId: string }): string {
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(payload: { userId: string }): string {
    return this.jwtService.sign(payload, {
      secret: jwtSecurity.jwtRefreshSecret,
      expiresIn: jwtSecurity.refreshIn,
    });
  }

  private buildUserVO(user: UserEntity): UserVO {
    return { user: filterObjProperties(user, ['password']) as User };
  }
}
