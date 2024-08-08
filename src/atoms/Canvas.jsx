import React, { useRef, useState, useEffect } from "react";
import logo from "../assets/carsImage.webp";

const CanvasComponent = () => {
  const canvasRef = useRef(null);
  const [rect, setRect] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const image = new Image();

    image.src = logo;
    image.onload = () => {
      const canvasAspectRatio = canvas.width / canvas.height;
      const imageAspectRatio = image.width / image.height;

      let drawWidth, drawHeight, offsetX, offsetY;

      if (imageAspectRatio > canvasAspectRatio) {
        drawHeight = canvas.height;
        drawWidth = image.width * (canvas.height / image.height);
        offsetX = -(drawWidth - canvas.width) / 2;
        offsetY = 0;
      } else {
        drawWidth = canvas.width;
        drawHeight = image.height * (canvas.width / image.width);
        offsetX = 0;
        offsetY = -(drawHeight - canvas.height) / 2;
      }

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);

      context.fillStyle = "rgba(255, 0, 0, 0.5)";
      context.fillRect(rect.x, rect.y, rect.width, rect.height);
    };
  }, []);

  const onCropClicked = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="canvas-container">
      <button onClick={onCropClicked}>Crop</button>
      <br></br>
      <canvas ref={canvasRef} width={500} height={600} className="canvas" />
    </div>
  );
};

export default CanvasComponent;
