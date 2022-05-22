import { useState, useRef, useEffect } from "react";
import { Action, Chat, ChatMessageSendEvent, Message, User } from "@progress/kendo-react-conversational-ui";

import ChatHeader from "./components/chat-header";

import { useLazyChatQuery, useLazySpecialitiesQuery, useLazyDoctorsQuery, useLazyBookingQuery } from "./api/chat-bot-api-slice";

import chatIc from "./assets/images/speech-bubble.svg";
import { ApiType } from "./enums/api-types";
import { timeSlot } from "./constants/time-slots";
import { DateFormat, formatDateTime, isValidDate } from "./utils/date-util";
import { isValidmail } from "./utils/validators";
import { getRandomInt } from "./utils/util";
import { greetings } from "./data/greetings";

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
  CLIENT_EMAIL = 5,
  CLIENT_AGE = 6,
  CLIENT_GENDER = 7,
  BOOKING_DATE = 8,
  CONN_WITH_BOT = 9,
  CONN_WITH_AGENT = 10,
  GREETING = 11,
};

function App() {
  const [chatWindowOpen, setChatWindowOpen] = useState(true);
  const [messages, setMessaage] = useState<Array<Message>>([]);
  const [doctors, setDoctors] = useState<Doctors>();
  const [specialities, setSpecialities] = useState<Specialities>();

  const chatIcRef = useRef<any>();
  const chatRef = useRef<any>();
  const stepRef = useRef<number>(Step.GREETING);
  const currApiTypeRef = useRef<number>();
  const bookingDetailsRef = useRef<Booking>({} as Booking);

  const [triggerChat, { data: chatData, isSuccess: isChatSuccess }] = useLazyChatQuery();
  const [triggerSpecialities] = useLazySpecialitiesQuery();
  const [triggerDoctors] = useLazyDoctorsQuery();
  const [triggerBooking] = useLazyBookingQuery();

  useEffect(() => {
    const index = getRandomInt(greetings.length);
    hideChatInput();

    const suggestedActions: Array<Action> = [
      {
        type: "reply",
        title: "Connect with our amazing chatbot.",
        value: { type: Step.CONN_WITH_BOT }
      },
      {
        type: "reply",
        title: "Contact one of our live agents.",
        value: { type: Step.CONN_WITH_AGENT }
      },
    ];
    const m1 = { author: bot, suggestedActions };

    updateThread([m1]);
  }, []);

  useEffect(() => {
    if (isChatSuccess && chatData) {
      updateThread([{ text: chatData.fulFillmentText, author: bot }]);
      handleIntentTypeApiCall(chatData.apiType, chatData.intentName);
    }
  }, [isChatSuccess, chatData]);

  const hideChatInput = () => chatRef.current.newMsgComp.inputEl.parentElement.hidden = true;
  const showChatInput = () => chatRef.current.newMsgComp.inputEl.parentElement.hidden = false;

  const handleBooking = async () => {
    const { data, isSuccess } = await triggerBooking(bookingDetailsRef.current, false);

    if (isSuccess) {
      updateThread([{ text: data.message, author: bot }]);
      stepRef.current = -1;
      bookingDetailsRef.current = {} as Booking;
    }
  }

  const handleFetchSpecialities = async (apiType: number, intentName: string) => {
    const { data, isSuccess } = await triggerSpecialities({ apiType, intentName });

    if (isSuccess) {
      setSpecialities(data);
      specialitiesActionsHandler(data.data);
    }
  }

  const handleFetchDoctors = async (apiType: number, intentName: string) => {
    const { data, isSuccess } = await triggerDoctors({ apiType, intentName });

    if (isSuccess) {
      setDoctors(data);
      doctorsActionsHandler(data.data, ApiType.DOCTORS);
    }
  }

  const addNewMessage = (e: ChatMessageSendEvent) => {
    let m: any = e.message.text;

    switch (stepRef.current) {
      case Step.GREETING: {
        greetingHandler(m.type);
        break;
      }
      case Step.SPECIALITIES: {
        const speciality = specialities?.data.find(s => s.id === m.specialityId);
        doctorsActionsHandler(speciality!.doctors, ApiType.SPECIALITIES, speciality!.specialityName);
        break;
      }
      case Step.DOCTORS: {
        bookingDetailsRef.current.doctorId = m.data.id;

        timeSlotsActionsHandler(m.data);
        break;
      }
      case Step.TIME_SLOTS: {
        const m1 = { text: m.timeSlot.label, author: user };
        const m2 = { author: bot, text: "Please enter the booking date. Use the following format" };
        const m3 = { author: bot, text: "yyyy-mm-dd (e.g. 2022-05-15)" };
        updateThread([m1, m2, m3]);

        bookingDetailsRef.current.timeSlotId = m.timeSlot.id;
        stepRef.current = Step.BOOKING_DATE;
        break;
      }
      case Step.BOOKING_DATE: {
        if (isValidDate(m)) {
          const m1 = { text: m, author: user };
          const m2 = { author: bot, text: "Please enter your name." };
          updateThread([m1, m2]);

          bookingDetailsRef.current.dateTime = `${formatDateTime(m, DateFormat.FORMAT_1)}T00:00:00.000Z`;
          stepRef.current = Step.CLIENT_NAME;
        } else {
          const m1 = { text: m, author: user };
          const m2 = { author: bot, text: "The date you entered is invalid. Please enter the booking date again." };
          updateThread([m1, m2]);
        }

        break;
      }
      case Step.CLIENT_NAME: {
        const m1 = { text: m, author: user };
        const m2 = { author: bot, text: "Please enter your email address." };
        updateThread([m1, m2]);

        bookingDetailsRef.current.name = m;
        stepRef.current = Step.CLIENT_EMAIL;
        break;
      }
      case Step.CLIENT_EMAIL: {
        if (isValidmail(m)) {
          const m1 = { text: m, author: user };

          const suggestedActions: Array<Action> = [
            { type: "reply", title: "Male", value: { id: 1, label: "Male" } },
            { type: "reply", title: "Female", value: { id: 2, label: "Female" } },
            { type: "reply", title: "Other", value: { id: 3, label: "Other" } },
          ];
          const m2 = { author: bot, text: "Please enter your birth gender.", suggestedActions };
          updateThread([m1, m2]);

          stepRef.current = Step.CLIENT_GENDER;
          bookingDetailsRef.current.email = m;
        } else {
          const m1 = { text: m, author: user };
          const m2 = { text: "Email is invalid! Please re-enter your email address.", author: user };
          updateThread([m1, m2]);
        }

        break;
      }
      case Step.CLIENT_GENDER: {
        const m1 = { text: m.label, author: user };
        const m2 = { author: bot, text: "Please enter your age." };
        updateThread([m1, m2]);

        stepRef.current = Step.CLIENT_AGE;
        bookingDetailsRef.current.gender = m.id;
        break;
      }
      case Step.CLIENT_AGE: {
        const m1 = { text: m.label, author: user };
        updateThread([m1]);

        bookingDetailsRef.current.age = m.label;
        handleBooking();
        break;
      }
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

  const greetingHandler = (type: number) => {
    stepRef.current = -1;
    let m1;

    if (type === Step.CONN_WITH_BOT)
      m1 = { author: bot, text: "MediBot is ready for your service." };
    else
      m1 = {
        author: bot,
        text: "You can connect with our live agent via 011-1231231.",
      };

    showChatInput();
    updateThread([m1]);
  }

  const doctorsActionsHandler = (data: Array<Doctor>, apiType: number, specialityName?: string) => {
    stepRef.current = Step.DOCTORS;
    const suggestedActions: Array<Action> = [];
    data.forEach(d => suggestedActions.push({ type: "reply", title: d.name, value: { data: d, step: Step.DOCTORS } }));

    if (apiType === ApiType.SPECIALITIES) {
      const m1 = { text: specialityName, author: user };
      const m2 = { author: bot, text: "Please select a doctor.", suggestedActions };
      updateThread([m1, m2]);
    } else if (apiType === ApiType.DOCTORS) {
      const m1 = { author: bot, text: "Please select a doctor.", suggestedActions };
      updateThread([m1]);
    }
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
    // setMessaage(messagesUpdated);
    setMessaage((prevState) => ([...prevState, ...m]));
  }

  const handleIntentTypeApiCall = (apiType: number, intentName: string) => {
    switch (apiType) {
      case ApiType.SPECIALITIES: {
        handleFetchSpecialities(apiType, intentName);
        break;
      }
      case ApiType.DOCTORS: {
        handleFetchDoctors(apiType, intentName);
        break;
      }
      default:
        break;
    }
  }

  const toggleChatWindow = () => setChatWindowOpen(!chatWindowOpen);

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
      {
        chatWindowOpen &&
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
      }

      <div className="button-container" onClick={toggleChatWindow}>
        <img src={chatIc} className="icon" ref={chatIcRef} />
      </div>
    </div>
  );
}

export default App;