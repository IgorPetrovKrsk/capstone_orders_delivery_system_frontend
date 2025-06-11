import { useEffect, useRef, useState } from 'react';

export default function WebSocketComponent() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL);

    ws.current.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.current.onmessage = (event) => {
      console.log('Message from server:', event.data);
      setMessages((prev) => [...prev, event.data]);
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  function sendMessage () {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(input);
      setInput('');
    }
  };

  return (
    <div>
      <h2>WebSocket Chat</h2>
      <div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <div>
        <h3>Messages:</h3>
        <ul>
          {messages.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}