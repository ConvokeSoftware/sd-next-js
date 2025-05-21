'use client';

import { useState, useRef, useEffect } from 'react';

const fakeMessages = [
  { user: 'You', text: 'Hey, anyone watching the Cardinals game tonight?' },
  { user: 'Alex', text: 'Yeah! I think they have a good shot.' },
  { user: 'Sam', text: 'I hope Murray is healthy.' },
  { user: 'You', text: 'Their defense needs to step up.' },
  { user: 'Alex', text: 'Agreed. Who do you think will score first?' },
];

export function SocialChat() {
  const [messages, setMessages] = useState(fakeMessages);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages([...messages, { user: 'You', text: input }]);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-48 overflow-y-auto bg-background rounded-lg border p-2">
      <div className="flex-1 space-y-2 mb-2">
        {messages.map((msg, i) => (
          <div key={i} className={msg.user === 'You' ? 'text-right' : 'text-left'}>
            <span
              className={
                msg.user === 'You'
                  ? 'inline-block bg-blue-500 text-white rounded-lg px-3 py-1'
                  : 'inline-block bg-gray-200 text-gray-900 rounded-lg px-3 py-1'
              }
            >
              <span className="font-semibold mr-2 text-xs">{msg.user}:</span>
              {msg.text}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          className="flex-1 border rounded px-2 py-1 text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
          Send
        </button>
      </form>
    </div>
  );
}
