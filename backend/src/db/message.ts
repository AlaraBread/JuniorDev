interface Message {

}

class MessageStore {
  private messages: Map<string, Message> = new Map();

  createMessage(...args: []): Message {
  }

  findMessages(...args: []): Message[] {
  }

}

export const messageStore = new MessageStore();
