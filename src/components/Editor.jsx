import React, { useState } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

const ImageWithText = () => {
  const [text, setText] = useState("Your text here");
  const [textPosition, setTextPosition] = useState({ x: 50, y: 50 });
  const [textSize, setTextSize] = useState({ width: 200, height: 50 });

  const handleDrag = (e, data) => {
    setTextPosition({ x: data.x, y: data.y });
  };

  const handleResize = (e, data) => {
    setTextSize({ width: data.size.width, height: data.size.height });
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <img
        src="https://via.placeholder.com/600x400"
        alt="Your Image"
        style={{ width: "100%", height: "auto" }}
      />
      <Draggable bounds="parent" position={textPosition} onDrag={handleDrag}>
        <ResizableBox
          width={textSize.width}
          height={textSize.height}
          onResize={handleResize}
          minConstraints={[50, 20]}
          maxConstraints={[300, 100]}
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{
              width: "100%",
              height: "100%",
              resize: "none",
              overflow: "hidden",
              border: "1px solid #ccc",
              padding: "5px",
              boxSizing: "border-box",
              background: "transparent",
              color: "white",
              fontSize: "16px",
              textAlign: "center",
            }}
          />
        </ResizableBox>
      </Draggable>
    </div>
  );
};

export default ImageWithText;
