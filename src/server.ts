import express from 'express';
import http from 'http';
import path from 'path';
import cors from 'cors';
import { Server } from 'socket.io';
import {
  rooms,
  exitRoom,
} from '../utils/rooms';
import {
  connectedUsers,
} from '../utils/users';
import {
  create,
  join,
  joinRandom,
} from './controllers/roomsController';

const app = express();
const PORT = process.env.PORT || 3001;

const server = http.createServer(app);

app.use(cors());
app.use(express.static(path.join(__dirname, 'src')));

const io = new Server(server, {
  cors: {
    origin:
    'https://alexanderkolomiiets.github.io',
  },
});

io.on('connection', (socket) => {
  socket.on('create_room', create);

  socket.on('join_room', join);

  socket.on('join_random_room', joinRandom);

  socket.on('choose', (data) => {
    const { roomId } = data;

    io.to(roomId).emit('player_turn', data);
  });

  socket.on('restart', (roomId) => {
    io.to(roomId).emit('restart');
  });

  socket.on('disconnect', () => {
    if (connectedUsers[socket.id]) {
      let player;
      let roomId;

      for (const id in rooms) {
        if (rooms[id].includes(socket.id)) {
          if (rooms[id][0] === socket.id) {
            player = 1;
          } else {
            player = 2;
          }

          roomId = id;
          break;
        }
      }

      if (player && roomId) {
        exitRoom(roomId, player);

        if (player === 1) {
          io.to(roomId).emit('player_1_disconnected');
        } else {
          io.to(roomId).emit('player_2_disconnected');
        }
      }
    }
  });
});

server.listen(`${PORT}`, () => {
  // eslint-disable-next-line no-console
  console.log(`Server started on port: ${PORT}`);
});
