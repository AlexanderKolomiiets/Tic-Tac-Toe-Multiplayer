export const connectedUsers: any = {};

export const userConnected = (userId: string) => {
  connectedUsers[userId] = true;
};
