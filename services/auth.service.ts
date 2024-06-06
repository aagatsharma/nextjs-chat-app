import httpStatus from 'http-status';
import tokenService from './token.service';
import userService from './user.service';
import ApiError from '../lib/ApiError';
import { TokenType, User } from '@prisma/client';
import { db as prisma } from '../lib/db';
import { encryptPassword, isPasswordMatch } from '../lib/encryption';

import exclude from '../lib/exclude';
import { AuthTokensResponse } from '@/types';

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Omit<User, 'password'>>}
 */
const loginUserWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<Omit<User, 'hashedPassword'>> => {
  const user = await userService.getUserByEmail(email, [
    'id',
    'email',
    'name',
    'hashedPassword',
    'phoneNumber',
    'imageUrl',
    'profilePicture',
    'createdAt',
    'updatedAt',
    'emailVerified'
  ]);
  if (
    !user ||
    !(await isPasswordMatch(password, user.hashedPassword as string))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }

  return exclude(user, ['hashedPassword']);
};

const logout = async (refreshToken: string): Promise<void> => {
  const refreshTokenData = await prisma.token.findFirst({
    where: {
      token: refreshToken,
      type: TokenType.REFRESH,
      blacklisted: false
    }
  });
  if (!refreshTokenData) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  await prisma.token.delete({ where: { id: refreshTokenData.id } });
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<AuthTokensResponse>}
 */
const refreshAuth = async (
  refreshToken: string
): Promise<AuthTokensResponse> => {
  try {
    const refreshTokenData = await tokenService.verifyToken(
      refreshToken,
      TokenType.REFRESH
    );
    const { userId } = refreshTokenData;
    await prisma.token.delete({ where: { id: refreshTokenData.id } });
    return tokenService.generateAuthTokens({ id: userId });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

const resetPassword = async (
  resetPasswordToken: string,
  newPassword: string
): Promise<void> => {
  try {
    const resetPasswordTokenData = await tokenService.verifyToken(
      resetPasswordToken,
      TokenType.RESET_PASSWORD
    );
    const user = await userService.getUserById(resetPasswordTokenData.userId);
    if (!user) {
      throw new ApiError(404, 'user not found');
    }
    const encryptedPassword = await encryptPassword(newPassword);
    await userService.updateUserById(user.id, {
      hashedPassword: encryptedPassword
    });
    // await prisma.token.deleteMany({ where: { userId: user.id, type: TokenType.RESET_PASSWORD } });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

const verifyEmail = async (verifyEmailToken: string): Promise<User> => {
  try {
    const verifyEmailTokenData = await tokenService.verifyToken(
      verifyEmailToken,
      TokenType.VERIFY_EMAIL
    );
    await prisma.token.deleteMany({
      where: {
        userId: verifyEmailTokenData.userId,
        type: TokenType.VERIFY_EMAIL
      }
    });
    return (await userService.updateUserById(verifyEmailTokenData.userId, {
      emailVerified: new Date()
    })) as User;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

const authServices = {
  loginUserWithEmailAndPassword,
  isPasswordMatch,
  encryptPassword,
  logout,
  refreshAuth,
  verifyEmail,
  resetPassword
};

export default authServices;
