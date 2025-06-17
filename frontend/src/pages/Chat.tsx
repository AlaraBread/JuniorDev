import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { config } from "../config";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
}

export default function Chat() {
  const queryClient = useQueryClient();
  const [params] = useSearchParams();
  const otherUserId = params.get("with");
  const { user } = useAuth();
  const chatQueryKey = ["messages", otherUserId, user?.id];
  const { data: messages } = useQuery({
    queryKey: chatQueryKey,
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const { data } = await axios.get<Message[]>(
        `${config.apiUrl}/chat?withUser=${encodeURIComponent(
          otherUserId as string
        )}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return data;
    },
  });
  const sendMessage = useMutation<undefined, undefined, string>({
    mutationFn: async (content) => {
      const token = localStorage.getItem("token");
      console.log("sending post");
      await axios.post(
        `${config.apiUrl}/chat/send`,
        { content, toUser: otherUserId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("invalidating query");
      queryClient.invalidateQueries({ queryKey: chatQueryKey });
    },
  });
  return (
    <div>
      {messages?.map((message) => (
        <div key={message.id}>
          {message.senderId}: {message.content}
        </div>
      ))}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.target as HTMLFormElement);
          sendMessage.mutate((formData.get("messageContent") ?? "") as string);
        }}
      >
        <input name="messageContent"></input>
        <button type="submit">send</button>
      </form>
    </div>
  );
}
