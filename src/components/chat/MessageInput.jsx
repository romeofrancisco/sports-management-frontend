import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

const MessageInput = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!message.trim()) return;
    onSendMessage(message.trim());
    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  return (
    <div className="p-4">
      <div className="flex gap-3">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 focus:ring-2 focus:ring-primary/20"
          disabled={disabled}
        />
        <Button
          onClick={handleSubmit}
          disabled={!message.trim() || disabled}
          size="icon"
          className="shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
