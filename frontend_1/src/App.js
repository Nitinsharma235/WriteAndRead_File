import { useEffect, useState } from "react";

function App() {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:2020");

    ws.onopen = () => {
      console.log("Connected to WebSocket server 1");
    };

    ws.onmessage = (event) => {
      console.log("Message from server1:", event.data);
    };

    ws.onclose = () => {
      console.log("Disconnected ");
    };

    setSocket(ws);

    
    return () => ws.close();
  }, []);

  const sendMessage = () => {
    if (socket && message.trim() !== "") {
      socket.send(message);
      setMessage(""); 
    }
  };

  return (
    <div >
      <h4>frontend</h4>
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>
        Send
      </button>
    </div>
  );
}

export default App;
