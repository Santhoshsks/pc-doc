import React from 'react';

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const handleMessageSend = async (userMessage, selectedModel) => {
    const botMessage = createChatBotMessage("Thinking...");

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));

    try {
      const response = await fetch('http://localhost:8000/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage, model: selectedModel }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const finalBotMessage = createChatBotMessage(data.response);

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, finalBotMessage],
      }));
    } catch (error) {
      console.error("Error fetching response:", error);
      const errorMessage = createChatBotMessage("Sorry, something went wrong.");
      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
      }));
    }
  };

  const handleHello = () => {
    const botMessage = createChatBotMessage('Hello. Nice to meet you.');
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: {
            handleMessageSend,
            handleHello
          },
        });
      })}
    </div>
  );
};

export default ActionProvider;
