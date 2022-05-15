import { useState, useRef, useEffect } from "react";
import { Chat, ChatMessageSendEvent, Message, User } from "@progress/kendo-react-conversational-ui";

import ChatHeader from "./components/chat-header";

import { useLazyChatQuery } from "./api/chat-bot-api-slice";
import { useAppDispatch } from "./hooks/hooks";
import { addMessage } from "./components/chat-slice";

import crossIc from "./assets/images/cross.svg";
import chatIc from "./assets/images/speech-bubble.svg";

const user: User = {
  id: 1,
} as const;

const bot = {
  id: 0,
};

function App() {
  const [chatWindowOpen, setChatWindowOpen] = useState(false);
  const [messages, setMessaage] = useState<Array<Message>>([]);

  const chatIcRef = useRef<any>();
  const closeIcRef = useRef<any>();
  const chatRef = useRef<any>();

  const [trigger, { data, isSuccess }] = useLazyChatQuery();

  useEffect(() => {
    if (isSuccess && data) {
      // const m: Message = { text: data.fulFillmentText, author: { id: "bot" } };
      // dispatch(addMessage(m));
      updateThread({ text: data.fulFillmentText, author: bot });
    }
  }, [data]);

  const CustomMessage = (props: any) => {
    return (
      <>
        {props.messageInput}
        {props.sendButton}
      </>
    );
  };

  const addNewMessage = (e: ChatMessageSendEvent) => {
    const m = e.message.text?.trim() || "";

    if (m.length) {
      // const messagesUpdated = [
      //   ...messages,
      //   { text: m, author: user }
      // ];

      // setMessaage(messagesUpdated);
      updateThread({ text: m, author: user });
      trigger(m, false);
    }
  }

  const updateThread = (m: any) => {
    const messagesUpdated = [...messages, m];
    setMessaage(messagesUpdated);
  }

  const toggleChatWindow = () => {
    const isOpen = !chatWindowOpen;

    if (isOpen) {
      chatIcRef.current.classList.add('hidden');
      closeIcRef.current.classList.remove('hidden');
    } else {
      chatIcRef.current.classList.remove('hidden');
      closeIcRef.current.classList.add('hidden');
    }

    setChatWindowOpen(isOpen);
  }

  return (
    <div className="chat-widget-layout">
      <div className="chat-container" id="chatContainer">
        <ChatHeader />

        <Chat
          ref={chatRef}
          user={user}
          messages={messages}
          onMessageSend={addNewMessage}
          placeholder={"Type a message..."}
          messageBox={CustomMessage}
        />
      </div>

      <div className="button-container" onClick={toggleChatWindow}>
        <img src={crossIc} className="icon hidden" ref={closeIcRef} />
        <img src={chatIc} className="icon" ref={chatIcRef} />
      </div>
    </div>
  );
}

export default App;