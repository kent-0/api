import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import {
  AuthEmailsEntity,
  AuthPasswordEntity,
  AuthTokensEntity,
  AuthUserEntity,
} from '~/database/entities';
import { DeviceTypes } from '~/database/enums/devices.enum';
import { TokenType } from '~/database/enums/token.enum';
import { AuthPasswordService } from '~/modules/auth/services/password.service';

import * as bcrypt from 'bcrypt';

import { AuthSignInInput } from '../inputs/sign-in.input';
import { AuthSignUpInput } from '../inputs/sign-up.input';
import { AuthUpdateAccountInput } from '../inputs/update-account.input';
import { JWTPayload } from '../interfaces/jwt.interface';
import { AuthSignInObject } from '../objects/sign-in.object';
import { AuthUserObject } from '../objects/user.object';

@Injectable()
export class AuthAccountService {
  constructor(
    @InjectRepository(AuthUserEntity)
    private readonly usersRespository: EntityRepository<AuthUserEntity>,
    @InjectRepository(AuthPasswordEntity)
    private readonly passwordRepository: EntityRepository<AuthPasswordEntity>,
    @InjectRepository(AuthTokensEntity)
    private readonly tokensRepository: EntityRepository<AuthTokensEntity>,
    @InjectRepository(AuthEmailsEntity)
    private readonly authEmailsRepository: EntityRepository<AuthEmailsEntity>,
    private readonly em: EntityManager,
    private readonly _jwtService: JwtService,
    private readonly _passwordService: AuthPasswordService,
  ) {}

  public async logOut(userToken: string, userId: string): Promise<string> {
    const token = await this.tokensRepository.findOne({
      token_type: TokenType.AUTH,
      token_value: userToken,
      user: userId,
    });

    if (!token) {
      throw new NotFoundException(
        'Your current session information could not be found.',
      );
    }

    token.revoked = true;
    await this.em.persistAndFlush(token);

    return 'Session closed successfully. See you soon.';
  }

  public async me(userId: string): Promise<AuthUserObject> {
    const user = await this.usersRespository.findOne(
      {
        id: userId,
      },
      {
        populate: ['email'],
      },
    );

    if (!user) {
      throw new NotFoundException(
        'Your user account information could not be obtained.',
      );
    }

    return user;
  }

  public async refreshSession(
    token: string,
    userId: string,
  ): Promise<AuthSignInObject> {
    const refreshToken = await this.tokensRepository.findOne({
      token_type: TokenType.REFRESH,
      token_value: token,
      user: userId,
    });

    if (!refreshToken) {
      throw new NotFoundException(
        'No information found for that session refresh token.',
      );
    }

    if (refreshToken.revoked) {
      throw new NotFoundException('The refresh token has been revoked.');
    }

    const refreshTokenValid = await this._jwtService.verifyAsync(
      refreshToken.token_value,
    );
    if (!refreshTokenValid) {
      refreshToken.revoked = true;

      await this.em.persistAndFlush(refreshToken);
      throw new UnauthorizedException(
        'The refresh token has expired, please log in again.',
      );
    }
    const tokenExp = Date.now() + 288e5;
    const tokenPayload: Omit<JWTPayload, 'raw'> = {
      iat: Date.now(),
      sub: userId,
    };

    const tokenAuth = await this._jwtService.signAsync(tokenPayload);
    const tokenAuthCreated = this.tokensRepository.create({
      device: DeviceTypes.NotFound,
      expiration: new Date(tokenExp),
      revoked: false,
      token_type: TokenType.AUTH,
      token_value: tokenAuth,
      user: userId,
    });

    await this.em.persistAndFlush(tokenAuthCreated);
    return {
      access_token: tokenAuthCreated.token_value,
      refresh_token: refreshToken.token_value,
    };
  }

  public async signIn({
    password,
    username,
  }: AuthSignInInput): Promise<AuthSignInObject> {
    const user = await this.usersRespository.findOne(
      {
        username,
      },
      {
        populate: ['password'],
      },
    );

    if (!user) {
      throw new UnauthorizedException('No account found with that username.');
    }

    const isMatchPassword = await bcrypt.compare(
      password,
      user.password!.password_hash,
    );

    if (!isMatchPassword) {
      throw new UnauthorizedException(
        'An incorrect password has been entered.',
      );
    }

    const tokenExp = Date.now() + 288e5;
    const tokenPayload: Omit<JWTPayload, 'raw'> = {
      iat: Date.now(),
      sub: user.id,
    };

    const tokenAuth = await this._jwtService.signAsync(tokenPayload);
    const tokenAuthCreated = this.tokensRepository.create({
      device: DeviceTypes.NotFound,
      expiration: new Date(tokenExp),
      revoked: false,
      token_type: TokenType.AUTH,
      token_value: tokenAuth,
      user,
    });

    const tokenRefresh = await this._jwtService.signAsync(tokenPayload, {
      expiresIn: '14d',
    });
    const tokenRefreshCreated = this.tokensRepository.create({
      device: DeviceTypes.NotFound,
      expiration: new Date(tokenExp),
      revoked: false,
      token_type: TokenType.REFRESH,
      token_value: tokenRefresh,
      user,
    });

    await this.em.persistAndFlush([tokenAuthCreated, tokenRefreshCreated]);

    return {
      access_token: tokenAuthCreated.token_value,
      refresh_token: tokenRefreshCreated.token_value,
    };
  }

  public async signUp({
    email,
    first_name,
    last_name,
    password,
    username,
  }: AuthSignUpInput): Promise<AuthUserObject> {
    const userExist = await this.usersRespository.findOne({
      $or: [{ username }, { email: { value: email } }],
    });

    if (userExist) {
      throw new BadRequestException(
        'An account already exists with that email or username.',
      );
    }

    const isEmailRegistered = await this.authEmailsRepository.findOne({
      value: email,
    });

    if (isEmailRegistered) {
      throw new BadRequestException(
        'There is already a registered user with that email.',
      );
    }

    const user = this.usersRespository.create({
      first_name,
      last_name,
      username,
    });

    await this.em.persistAndFlush(user);

    const passwordHashed = await this._passwordService.generate(password);
    const userPassword = this.passwordRepository.create({
      password_hash: passwordHashed.hash,
      salt: passwordHashed.salt,
      user,
    });

    user.password = userPassword;

    const userEmail = this.authEmailsRepository.create({
      user,
      value: email,
    });

    user.email = userEmail;

    await this.em.persistAndFlush([userEmail, userPassword, user]);
    return user;
  }

  public async update(
    { biography, first_name, last_name, username }: AuthUpdateAccountInput,
    userId: string,
  ): Promise<AuthUserObject> {
    const user = await this.usersRespository.findOne(
      {
        id: userId,
      },
      {
        populate: ['email'],
      },
    );

    if (!user) {
      throw new NotFoundException(
        'Your account information could not be obtained.',
      );
    }

    const usernameExist = await this.usersRespository.findOne({
      username,
    });

    if (usernameExist && usernameExist.id !== userId) {
      throw new BadRequestException(
        "You can't select that username because another user already has it.",
      );
    }

    user.username = username;
    user.first_name = first_name;
    user.last_name = last_name;
    user.biography = biography;

    await this.em.persistAndFlush(user);
    return user;
  }
}