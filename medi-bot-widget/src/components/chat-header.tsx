import React from "react";
import { Avatar } from "@progress/kendo-react-layout";

interface IChatHeader {
  name: string;
  photoUrl: string;
}

const ChatHeader = ({ name, photoUrl }: IChatHeader) => {
  const getAvatar = () => {
    if (photoUrl) {
      return (
        <Avatar shape="circle" type="image" className="avatar">
          <img src={photoUrl} alt={name} />
        </Avatar>
      );
    }

    return (
      <Avatar shape="circle" type="text" className="avatar">
        {name[0]}
      </Avatar>
    );
  };

  return (
    <div className="chat-header">
      {getAvatar()}

      <div>
        <p className="d-name">{name}</p>
      </div>
    </div>
  );
};

export default ChatHeader;
