import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

type LiveUpdatePayload = {
  userId: string;
  resources: string[];
  type: 'invalidate' | 'reward';
  reward?: {
    milestoneXp?: number;
    goalBonusXp?: number;
    questXp?: number;
    totalXp: number;
    title: string;
  } | null;
};

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class LiveUpdatesGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    const userId = this.getUserIdFromClient(client);

    if (userId) {
      client.join(this.getRoomName(userId));
    }
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { userId?: string }
  ) {
    const userId = body?.userId ?? this.getUserIdFromClient(client);

    if (userId) {
      client.join(this.getRoomName(userId));
    }

    return { ok: true };
  }

  emitUserUpdate(payload: LiveUpdatePayload) {
    this.server.to(this.getRoomName(payload.userId)).emit('lifexp:update', payload);
  }

  private getRoomName(userId: string) {
    return `user:${userId}`;
  }

  private getUserIdFromClient(client: Socket) {
    const queryUserId = client.handshake.query.userId;
    const authUserId = client.handshake.auth?.userId;

    if (typeof authUserId === 'string' && authUserId.length > 0) {
      return authUserId;
    }

    if (typeof queryUserId === 'string' && queryUserId.length > 0) {
      return queryUserId;
    }

    return null;
  }
}
