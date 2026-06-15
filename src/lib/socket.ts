import { io, Socket } from 'socket.io-client';
import { getSocketOrigin } from '@/lib/backend-url';

let socket: Socket | null = null;

export function getCommunitySocket(): Socket | null {
  return socket;
}

export function connectCommunitySocket(token: string): Socket {
  if (socket?.connected) {
    return socket;
  }

  if (socket) {
    socket.auth = { token };
    socket.connect();
    return socket;
  }

  socket = io(getSocketOrigin(), {
    path: '/socket.io',
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    autoConnect: true,
  });

  socket.on('connect', () => {
    socket?.emit('community:join');
  });

  return socket;
}

export function disconnectCommunitySocket(): void {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}
