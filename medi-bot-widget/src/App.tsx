import { useState, useRef, useEffect } from "react";
import { Action, Chat, ChatMessageSendEvent, Message, User } from "@progress/kendo-react-conversational-ui";

import ChatHeader from "./components/chat-header";

import { useLazyChatQuery, useLazySpecialitiesQuery, useLazyDoctorsQuery, useLazyBookingQuery } from "./api/chat-bot-api-slice";
import { useAppDispatch } from "./hooks/hooks";
import { addMessage } from "./components/chat-slice";

import crossIc from "./assets/images/cross.svg";
import chatIc from "./assets/images/speech-bubble.svg";
import { ApiType } from "./enums/api-types";
import { timeSlot } from "./constants/time-slots";

const user: User = {
  id: 1,
} as const;

const bot = {
  id: 0,
};

enum Step {
  SPECIALITIES = 1,
  DOCTORS = 2,
  TIME_SLOTS = 3,
  CLIENT_DETAILS = 4,
};

function App() {
  const [chatWindowOpen, setChatWindowOpen] = useState(false);
  const [messages, setMessaage] = useState<Array<Message>>([]);
  const [doctors, setDoctors] = useState<Array<any>>([]);
  const [specialities, setSpecialities] = useState<Specialities>();

  const chatIcRef = useRef<any>();
  const closeIcRef = useRef<any>();
  const chatRef = useRef<any>();

  const [triggerChat, { data: chatData, isSuccess: isChatSuccess }] = useLazyChatQuery();
  const [triggerSpecialities, { data: specialitiesData, isSuccess: isSpecialitiesSuccess }] = useLazySpecialitiesQuery();
  const [triggerDoctors, { data: doctorsData, isSuccess: isDoctorsSuccess }] = useLazyDoctorsQuery();
  const [triggerBooking, { data: bookingData, isSuccess: isBookingSuccess }] = useLazyBookingQuery();

  useEffect(() => {
    if (isChatSuccess && chatData) {
      // const m: Message = { text: data.fulFillmentText, author: { id: "bot" } };
      // dispatch(addMessage(m));
      updateThread([{ text: chatData.fulFillmentText, author: bot }]);
      handleIntentTypeApiCall(chatData.apiType, chatData.intentName);
    }
  }, [chatData]);

  useEffect(() => {
    if (isChatSuccess && specialitiesData) {
      setSpecialities(specialitiesData);
      specialitiesActionsHandler(specialitiesData.data);
    }
  }, [isSpecialitiesSuccess, specialitiesData]);

  useEffect(() => {
    if (isDoctorsSuccess && doctorsData) {
      console.log(doctorsData);
    }
  }, [isDoctorsSuccess, doctorsData]);

  const CustomMessage = (props: any) => {
    return (
      <>
        {props.messageInput}
        {props.sendButton}
      </>
    );
  };

  const addNewMessage = (e: ChatMessageSendEvent) => {
    let m: any = e.message.text;

    if (typeof m === 'object') {
      switch (m.step) {
        case Step.SPECIALITIES: {
          const speciality = specialities?.data.find(s => s.id === m.specialityId);
          doctorsActionsHandler(speciality!.specialityName, speciality!.doctors);
          break;
        }
        case Step.DOCTORS: {
          timeSlotsActionsHandler(m.data);
          break;
        }
        case Step.TIME_SLOTS: {
          updateThread([{ text: m.timeSlot.label, author: user }]);
          break;
        }
        default:
          break;
      }
    } else {
      m = m?.trim() || "";

      if (m.length) {
        updateThread([{ text: m, author: user }]);
        triggerChat(m, false);
      }
    }
  }

  const specialitiesActionsHandler = (data: Array<Speciality>) => {
    const suggestedActions: Array<Action> = [];
    data.forEach(s => suggestedActions.push({
      type: "reply",
      title: s.specialityName,
      value: { specialityId: s.id, step: Step.SPECIALITIES }
    }));

    const m = { author: bot, suggestedActions };
    updateThread([m]);
  }

  const doctorsActionsHandler = (specialityName: string, data: Array<Doctor>) => {
    const suggestedActions: Array<Action> = [];
    data.forEach(d => suggestedActions.push({ type: "reply", title: d.name, value: { data: d, step: Step.DOCTORS } }));

    const m1 = { text: specialityName, author: user };
    const m2 = { author: bot, text: "Please select a doctor.", suggestedActions };
    updateThread([m1, m2]);
  }

  const timeSlotsActionsHandler = (data: Doctor) => {
    const suggestedActions: Array<Action> = [];
    const timeSlotIds = data.timeSlotIds.split(',');
    timeSlotIds.forEach(id => suggestedActions.push({
      type: "reply",
      title: timeSlot[id],
      value: { timeSlot: { id: id, label: timeSlot[id] }, step: Step.TIME_SLOTS }
    }));

    const m1 = { text: data.name, author: user };
    const m2 = { author: bot, text: "Please select a time slot.", suggestedActions };
    updateThread([m1, m2]);
  }

  const updateThread = (m: Array<Message>) => {
    const messagesUpdated = [...messages, ...m];
    setMessaage(messagesUpdated);
  }

  const handleIntentTypeApiCall = (apiType: number, intentName: string) => {
    switch (apiType) {
      case ApiType.SPECIALITIES: {
        triggerSpecialities({ apiType, intentName }, false);
        break;
      }
      case ApiType.DOCTORS: {
        triggerDoctors({ apiType, intentName }, false);
        break;
      }
      default:
        break;
    }
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