import { useEffect, useState } from "react";
import { useSearchParams } from 'react-router-dom';



function FileCmp() {
  const [messages, setMessages] = useState([]);
  const [searchParams] = useSearchParams();
  const lines = parseInt(searchParams.get("lines") || 10);
  const readFromEnd = searchParams.get("readfromend") === "true";
  const readFromStart = searchParams.get("readfromstart") === "true";

  useEffect(() => {
    const wsBaseUrl = "ws://localhost:3030";
    let wsUrl = `${wsBaseUrl}?lines=${lines}`;

    if (readFromEnd) wsUrl += "&readfromend=true";
    if (readFromStart) wsUrl += "&readfromstart=true";

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("Connected to Server 2");
    };

    ws.onmessage = (event) => {
      console.log("event.data",event.data);
      const msg = JSON.parse(event.data);

      if (msg.type === "init") {
        console.log("ms.type",msg.type);
        setMessages(msg.data);
      }

      if(msg.type === "update"){
          setMessages( (prev) => [...prev, msg.data]);
      }

    };

    ws.onclose = () => {
      console.log("Disconnected from Server 2");
    };

    return () => ws.close(); 
  }, [readFromEnd,readFromStart,lines]);

  return (
    <div style={{ padding: "20px" }}>
      <h4>Messages from server_one_Data.txt file</h4>
      {messages.map((line, index) => (
        <span key={index}>
          {line}
          <br />
        </span>
      ))}
    </div>
  );
}

export default FileCmp;
