import React from "react";

import smilingChatBubble from "../assets/images/smiling-speech-bubble.svg";

const Loading = () => (
  <div className="chat-loading">
    <img
      className="img-speech-bubble shake-vertical"
      src={smilingChatBubble}
      alt="Chat loading"
    />
    <p className="title">Hello!</p>
    <p className="message">You're being connected to the doctor...</p>
  </div>
);

export default Loading;
