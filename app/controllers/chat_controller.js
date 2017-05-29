const allChats = new Map();

export const initChat = (room) => {
  if (!allChats.get(room)) {
    allChats.set(room, []);
  }
};

export const addToChat = (room, content) => {
  if (allChats.get(room)) {
    const newchat = [...allChats.get(room), content];
    allChats.set(room, newchat);
  }
};

export const returnChat = (room) => {
  return allChats.get(room);
};
