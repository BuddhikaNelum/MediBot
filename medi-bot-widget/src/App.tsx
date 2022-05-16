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
  CLIENT_NAME = 4,
  CLIENT_NAME_PENDING = 5,
  CLIENT_EMAIL = 6,
  CLIENT_EMAIL_PENDING = 7,
  CLIENT_AGE = 8,
  CLIENT_AGE_PENDING = 9,
  CLIENT_GENDER = 10,
  CLIENT_GENDER_PENDING = 11,
};

function App() {
  const [chatWindowOpen, setChatWindowOpen] = useState(false);
  const [messages, setMessaage] = useState<Array<Message>>([]);
  const [doctors, setDoctors] = useState<Array<any>>([]);
  const [specialities, setSpecialities] = useState<Specialities>();
  const [completed, setCompleted] = useState<any>({});

  const chatIcRef = useRef<any>();
  const closeIcRef = useRef<any>();
  const chatRef = useRef<any>();
  const stepRef = useRef<number>();
  const clientDetailsRef = useRef<Booking>({} as Booking);

  const [triggerChat, { data: chatData, isSuccess: isChatSuccess }] = useLazyChatQuery();
  const [triggerSpecialities, { data: specialitiesData, isSuccess: isSpecialitiesSuccess }] = useLazySpecialitiesQuery();
  const [triggerDoctors, { data: doctorsData, isSuccess: isDoctorsSuccess }] = useLazyDoctorsQuery();
  const [triggerBooking, { data: bookingData, isSuccess: isBookingSuccess }] = useLazyBookingQuery();

  useEffect(() => {
    if (isChatSuccess && chatData) {
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

  useEffect(() => {
    if (isBookingSuccess && bookingData) {
      if (bookingData.status) {
        updateThread([{ text: bookingData.message, author: bot }]);
      }
    }
  }, [isBookingSuccess, bookingData]);

  const addNewMessage = (e: ChatMessageSendEvent) => {
    let m: any = e.message.text;

    switch (stepRef.current) {
      case Step.SPECIALITIES: {
        const speciality = specialities?.data.find(s => s.id === m.specialityId);
        doctorsActionsHandler(speciality!.specialityName, speciality!.doctors);
        break;
      }
      case Step.DOCTORS: {
        clientDetailsRef.current.doctorId = m.data.id;

        timeSlotsActionsHandler(m.data);
        break;
      }
      case Step.TIME_SLOTS: {
        clientDetailsRef.current.timeSlotId = m.timeSlot.id;

        const m1 = { text: m.timeSlot.label, author: user };
        const m2 = { author: bot, text: "Please enter your name." };
        updateThread([m1, m2]);

        clientDetailsRef.current.timeSlotId = m.timeSlot.id;
        stepRef.current = Step.CLIENT_NAME;
        break;
      }
      case Step.CLIENT_NAME: {
        const m1 = { text: m, author: user };
        const m2 = { author: bot, text: "Please enter your email address." };
        updateThread([m1, m2]);

        clientDetailsRef.current.name = m;
        stepRef.current = Step.CLIENT_EMAIL;
        break;
      }
      case Step.CLIENT_EMAIL: {
        const m1 = { text: m, author: user };

        const suggestedActions: Array<Action> = [
          { type: "reply", title: "Male", value: { id: 1, label: "Male" } },
          { type: "reply", title: "Female", value: { id: 2, label: "Female" } },
          { type: "reply", title: "Other", value: { id: 3, label: "Other" } },
        ];
        const m2 = { author: bot, text: "Please enter your birth gender.", suggestedActions };
        updateThread([m1, m2]);

        stepRef.current = Step.CLIENT_GENDER;
        clientDetailsRef.current.email = m;
        break;
      }
      case Step.CLIENT_GENDER: {
        const m1 = { text: m.label, author: user };
        const m2 = { author: bot, text: "Please enter your age." };
        updateThread([m1, m2]);

        stepRef.current = Step.CLIENT_AGE;
        clientDetailsRef.current.gender = m.id;
        break;
      }
      case Step.CLIENT_AGE: {
        const m1 = { text: m.label, author: user };
        updateThread([m1]);

        triggerBooking(clientDetailsRef.current);
        break;
      }
      // case Step.CLIENT_NAME_PENDING: {
      //   updateThread([{ text: m, author: user }]);
      //   stepRef.current = Step.CLIENT_EMAIL;
      //   clientDetailsRef.current.name = m;
      //   break;
      // }
      default: {
        m = m?.trim() || "";

        if (m.length) {
          updateThread([{ text: m, author: user }]);
          triggerChat(m, false);
        }

        break;
      }
    }
  }

  const specialitiesActionsHandler = (data: Array<Speciality>) => {
    stepRef.current = Step.SPECIALITIES;
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
    stepRef.current = Step.DOCTORS;
    const suggestedActions: Array<Action> = [];
    data.forEach(d => suggestedActions.push({ type: "reply", title: d.name, value: { data: d, step: Step.DOCTORS } }));

    const m1 = { text: specialityName, author: user };
    const m2 = { author: bot, text: "Please select a doctor.", suggestedActions };
    updateThread([m1, m2]);
  }

  const timeSlotsActionsHandler = (data: Doctor) => {
    stepRef.current = Step.TIME_SLOTS;
    const suggestedActions: Array<Action> = [];
    const timeSlotIds = data.timeSlotIds.split(',');
    timeSlotIds.forEach(id => suggestedActions.push({
      type: "reply",
      title: timeSlot[id],
      value: { timeSlot: { id: id, label: timeSlot[id] }, step: Step.TIME_SLOTS }
    }));

    stepRef.current = Step.TIME_SLOTS;

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

  const CustomMessage = (props: any) => {
    return (
      <>
        {props.messageInput}
        {props.sendButton}
      </>
    );
  };

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