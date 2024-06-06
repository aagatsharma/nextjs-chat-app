import { User, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import { db as prisma } from '../lib/db';
import ApiError from '../lib/ApiError';
import { encryptPassword } from '../lib/encryption';

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (
  email: string,
  password: string,
  name: string,
  phoneNumber: string
): Promise<User> => {
  return prisma.user.create({
    data: {
      email,
      name,
      phoneNumber,
      hashedPassword: await encryptPassword(password)
    }
  });
};

const updateProfilePicture = async (pic: string, userId: string) => {
  return prisma.user.update({
    where: {
      id: userId
    },
    data: {
      profilePicture: pic
    }
  });
};

const queryUsers = async <Key extends keyof User>(
  filter: object,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortType?: 'asc' | 'desc';
  },
  keys: Key[] = [
    'id',
    'email',
    'name',
    'hashedPassword',
    'role',
    'createdAt',
    'updatedAt'
  ] as Key[]
): Promise<Pick<User, Key>[]> => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const sortBy = options.sortBy;
  const sortType = options.sortType ?? 'desc';
  const users = await prisma.user.findMany({
    where: filter,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    skip: page * limit,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortType } : undefined
  });
  return users as Pick<User, Key>[];
};

const getUserById = async <Key extends keyof User>(
  id: string,
  keys: Key[] = [
    'id',
    'email',
    'name',
    'hashedPassword',
    'role',
    'createdAt',
    'updatedAt'
  ] as Key[]
): Promise<Pick<User, Key> | null> => {
  return prisma.user.findUnique({
    where: { id },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  }) as Promise<Pick<User, Key> | null>;
};

const getUserByEmail = async <Key extends keyof User>(
  email: string,
  keys: Key[] = [
    'id',
    'email',
    'name',
    'role',
    'createdAt',
    'updatedAt'
  ] as Key[]
): Promise<Pick<User, Key> | null> => {
  return prisma.user.findUnique({
    where: { email },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  }) as Promise<Pick<User, Key> | null>;
};

const updateUserById = async <Key extends keyof User>(
  userId: string,
  updateBody: Prisma.UserUpdateInput,
  keys: Key[] = ['id', 'email', 'name', 'role'] as Key[]
): Promise<Pick<User, Key> | null> => {
  const user = await getUserById(userId, ['id', 'email', 'name']);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: updateBody,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  });
  return updatedUser as Pick<User, Key> | null;
};

const deleteUserById = async (userId: string): Promise<User> => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await prisma.user.delete({ where: { id: user.id } });
  return user;
};

const userServices = {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserById,
  updateProfilePicture
};

export default userServices;
