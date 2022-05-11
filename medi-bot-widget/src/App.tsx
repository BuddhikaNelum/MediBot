import React, { useState, useEffect, useRef } from "react";
import { Chat } from "@progress/kendo-react-conversational-ui";

import ChatHeader from "./components/chat-header";
import Loading from "./components/loading";

import crossIc from "./assets/images/cross.svg";
import chatIc from "./assets/images/speech-bubble.svg";

const WidgetStatus = {
  LOADING: 1,
  LOADED: 2,
} as const;

function App() {
  const [status, setStatus] = useState<number | null>(null);
  const [chatWindowOpen, setChatWindowOpen] = useState(false);
  const [chat, setChat] = useState<any>(null);
  const [messages, setMessages] = useState([]);

  const chatIcRef = useRef<any>();
  const closeIcRef = useRef<any>();
  const chatRef = useRef<any>();

  useEffect(() => {
    if (chat)
      intializeConversationAsync();
  }, [chat]);

  const CustomMessage = (props: any) => {
    return (
      <>
        {props.messageInput}
        {props.sendButton}
      </>
    );
  };

  const intializeConversationAsync = () => {
    //TODO: Handle initializing conversation
  }

  const addNewMessage = () => {
    // TODO: Handle new messages added
  };

  const toggleChatWindow = () => {
    const isOpen = !chatWindowOpen;

    if (isOpen) {
      chatIcRef.current.classList.add('hidden');
      closeIcRef.current.classList.remove('hidden');
    } else {
      chatIcRef.current.classList.remove('hidden');
      closeIcRef.current.classList.add('hidden');
    }

    if (!status) {
      setStatus(WidgetStatus.LOADING);
    }

    setChatWindowOpen(isOpen);
  }

  const renderChat = () => {
    if (status === WidgetStatus.LOADED) {
      return (
        <div className="chat-container" id="chatContainer">
          <ChatHeader name={chat.dentist.name} photoUrl={chat.dentist.picture} />

          <Chat
            ref={chatRef}
            user={{ id: chat.clientIdentity }}
            messages={messages}
            onMessageSend={addNewMessage}
            placeholder={"Type a message..."}
            messageBox={CustomMessage}
          />
        </div>
      );
    }

    return (<Loading />);
  }

  return (
    <div className="chat-widget-layout">
      {chatWindowOpen && renderChat()}

      <div className="button-container" onClick={toggleChatWindow}>
        <img src={crossIc} className="icon hidden" ref={closeIcRef} />
        <img src={chatIc} className="icon" ref={chatIcRef} />
      </div>
    </div>
  );
}

export default App;