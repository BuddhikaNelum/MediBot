import { Message, User } from "@progress/kendo-react-conversational-ui";

type Chat = {
  fulFillmentText: string;
  intentName: string;
  isIntentResponse: boolean;
  apiType: number;
}

type ChatResponse = Chat;