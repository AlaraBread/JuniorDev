import { UUID } from "crypto";

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
}

class MessageStore {
  private messages: Map<UUID, Message[]> = new Map();
  private chats: Map<`${UUID}${UUID}`, string> = new Map();

  private getChatId(
    senderId: UUID,
    receiverId: UUID,
  ): UUID {
    const smallerUser = senderId < receiverId ? senderId : receiverId;
    const biggerUser = senderId > receiverId ? senderId : receiverId;
    const chatKey = smallerUser + biggerUser;
    if (chatKey in this.chats) {
      return this.chats[chatKey];
    } else {
      console.log("creating new chat");
      const newId = crypto.randomUUID();
      this.chats[chatKey] = newId;
      this.messages[newId] = [];
      return newId;
    }
  }

  createMessage(
    content: string,
    senderId: UUID,
    receiverId: UUID,
  ): Message {
    const message: Message = {
      id: crypto.randomUUID(),
      content,
      senderId,
      receiverId,
    };
    console.log("chats: ", this.chats);
    const chatId = this.getChatId(senderId, receiverId);

    console.log("chats: ", this.chats);
    console.log("chatId: ", chatId);
    console.log("messages: ", this.messages);
    this.messages[chatId].push(message);
    return message;
  }

  findMessages(user1: UUID, user2: UUID): Message[] {
    const chatId = this.getChatId(user1, user2);
    return chatId in this.messages ? this.messages[chatId] : [];
  }
}

export const messageStore = new MessageStore();
