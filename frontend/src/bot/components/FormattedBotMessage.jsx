import React from "react";

const FormattedBotMessage = ({ text }) => {
  if (!text) return null;

  const lines = text.split("\n");
  const elements = [];

  lines.forEach((line, index) => {
    const boldMatch = line.match(/^\*\s*([^:]+):\s*(.*)/);
    if (boldMatch) {
      elements.push(
        <p key={index}>
          <strong>{boldMatch[1]}:</strong> {boldMatch[2]}
        </p>
      );
    }
    else if (line.trim().startsWith("*")) {
      elements.push(
        <li key={index}>{line.replace(/^\*\s*/, "")}</li>
      );
    }
    else {
      elements.push(<p key={index}>{line}</p>);
    }
  });

  const finalElements = [];
  let bulletGroup = [];

  elements.forEach((el) => {
    if (el.type === "li") {
      bulletGroup.push(el);
    } else {
      if (bulletGroup.length) {
        finalElements.push(<ul key={`ul-${finalElements.length}`}>{bulletGroup}</ul>);
        bulletGroup = [];
      }
      finalElements.push(el);
    }
  });

  if (bulletGroup.length) {
    finalElements.push(<ul key={`ul-last`}>{bulletGroup}</ul>);
  }

  return <div>{finalElements}</div>;
};

export default FormattedBotMessage;
