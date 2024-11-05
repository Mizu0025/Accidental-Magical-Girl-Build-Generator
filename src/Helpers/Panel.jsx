import React from "react";
import "./Panel.css";

const Panel = ({ position, title, content }) => {
  return (
    <div className={`${position}`}>
      <h3>{title}</h3>
      {content}
    </div>
  );
};

export default Panel;
