import { Server as NetServer, Socket } from 'net';
import { NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { Server, Member, Profile, User } from '@prisma/client';

export type ServerWithMembersWithProfiles = Server & {
  members: (Member & { profile: Profile })[];
};

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};
export interface TokenResponse {
  token: string;
  expires: Date;
}

export interface AuthTokensResponse {
  access: TokenResponse;
  refresh?: TokenResponse;
}

export type HandlerType = (
  request: Request | ProtectedRequest,
  context?: any
) => Promise<Response>;
export interface ProtectedRequest extends Request {
  user: User;
}
