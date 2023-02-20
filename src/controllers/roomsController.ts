import { Socket } from 'socket.io';
import {
  rooms,
  createRoom,
  joinRoom,
} from '../../utils/rooms';
import {
  initializeChoices,
  userConnected,
} from '../../utils/users';
import { Error } from '../../types/Error';

export function create(this: Socket, roomId: string) {
  if (rooms[roomId]) {
    this.emit('show_error', Error.Exist);
  } else {
    userConnected(this.id);
    createRoom(roomId, this.id);
    this.emit('room_created', roomId);
    this.emit('player_1_connected');
    this.join(roomId);
  }
}

export function join(this: Socket, roomId: string) {
  if (!rooms[roomId]) {
    this.emit('show_error', Error.NotExist);
  } else if (rooms[roomId][1] !== '') {
    this.emit('show_error', Error.Full);
  } else {
    userConnected(this.id);
    joinRoom(roomId, this.id);
    this.join(roomId);

    this.emit('room_joined', roomId);
    this.emit('player_2_connected');
    this.broadcast.to(roomId).emit('player_2_connected');
    initializeChoices(roomId);
  }
}

export function joinRandom(this: Socket) {
  let roomId = '';

  for (const id in rooms) {
    if (rooms[id][1] === '') {
      roomId = id;
      break;
    }
  }

  if (roomId === '') {
    this.emit('show_error', Error.Full);
  } else {
    userConnected(this.id);
    joinRoom(roomId, this.id);
    this.join(roomId);

    this.emit('room_joined', roomId);
    this.emit('player_2_connected');
    this.broadcast.to(roomId).emit('player_2_connected');
    initializeChoices(roomId);
  }
}
