export const rooms: any = {};

export const createRoom = (roomId: string, playerId: string) => {
  rooms[roomId] = [playerId, ''];
};

export const joinRoom = (roomId: string, player2Id: string) => {
  rooms[roomId][1] = player2Id;
};

export const exitRoom = (roomId: string, player: number) => {
  if (player === 1) {
    delete rooms[roomId];
  } else {
    rooms[roomId][1] = '';
  }
};
