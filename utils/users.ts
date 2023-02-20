export const connectedUsers: any = {};
export const choices: any = {};

export const initializeChoices = (roomId: string) => {
  choices[roomId] = ['', ''];
};

export const userConnected = (userId: string) => {
  connectedUsers[userId] = true;
};
