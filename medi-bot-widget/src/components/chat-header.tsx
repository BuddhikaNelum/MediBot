import { Avatar } from "@progress/kendo-react-layout";

import medibot from "../assets/images/medibot.png";

const ChatHeader = () => {

  return (
    <div className="chat-header">
      <Avatar shape="circle" type="image" className="avatar">
        <img src={medibot} alt="Medibot" />
      </Avatar>

      <div>
        <p className="d-name">Mediibot</p>
      </div>
    </div>
  );
};

export default ChatHeader;
