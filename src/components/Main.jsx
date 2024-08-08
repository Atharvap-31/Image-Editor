import React, { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import Demo from "./Demo";

const Main = ({
  selectedImage,
  selectedSocialMedia,
  filter,
  activeTextInput,
  setCroppedImage,
  croppedImage,
  textInputs,
  setTextInputs,
  cropperRef,
}) => {
  const [isCropping, setIsCropping] = useState(false);
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: 300,
    height: 300,
  });

  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const { width, height } = getCanvasDimensions();
    setCanvasDimensions({ width, height });

    setTextInputs((prevState) => ({
      header: { ...prevState.header, x: 10, y: 10 },
      body: { ...prevState.body, x: 10, y: 0 },
      caption: { ...prevState.caption, x: 10, y: 0 },
    }));
  }, [selectedSocialMedia]);

  useEffect(() => {
    if (croppedImage) {
      renderImage(croppedImage);
    } else {
      renderImage(selectedImage);
    }
  }, [selectedImage, filter, canvasDimensions, croppedImage, textInputs]);

  const getCanvasDimensions = () => {
    switch (selectedSocialMedia) {
      case "instagram":
        return { width: 400, height: 300 };
      case "pinterest":
        return { width: 400, height: 450 };
      case "facebook":
        return { width: 500, height: 250 };
      default:
        return { width: 300, height: 300 };
    }
  };

  const renderImage = (imageSrc) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = imageSrc;

    img.onload = () => {
      const containerWidth = canvasDimensions.width;
      const containerHeight = canvasDimensions.height;

      canvas.width = containerWidth;
      canvas.height = containerHeight;

      ctx.clearRect(0, 0, containerWidth, containerHeight);

      const aspectRatio = img.width / img.height;
      let newWidth, newHeight;

      if (aspectRatio > containerWidth / containerHeight) {
        newHeight = containerHeight;
        newWidth = aspectRatio * containerHeight;
      } else {
        newWidth = containerWidth;
        newHeight = containerWidth / aspectRatio;
      }

      const xOffset = (containerWidth - newWidth) / 2;
      const yOffset = (containerHeight - newHeight) / 2;

      ctx.filter = filter;
      ctx.drawImage(img, xOffset, yOffset, newWidth, newHeight);

      // Apply text inputs
      Object.entries(textInputs).forEach(([key, input]) => {
        if (input.visible) {
          ctx.font =
            key === "header"
              ? "bold 24px Arial"
              : key === "body"
              ? "18px Arial"
              : "italic 16px Arial";
          ctx.fillStyle = "white";
          ctx.fillText(input.text, input.x, input.y);
        }
      });
    };
  };

  const handleCropButtonClick = () => {
    if (selectedImage) {
      setIsCropping(true);
    }
  };

  const handleCroppedImage = (croppedImage) => {
    if (croppedImage) {
      setCroppedImage(croppedImage);
    }
    setIsCropping(false);
  };

  const handleTextChange = (key, value) => {
    setTextInputs((prevState) => ({
      ...prevState,
      [key]: { ...prevState[key], text: value },
    }));
  };

  const handleDrag = (e, data, key) => {
    const newX = Math.max(
      0,
      Math.min(data.x, canvasDimensions.width - textInputs[key].width)
    );
    const newY = Math.max(
      0,
      Math.min(data.y, canvasDimensions.height - textInputs[key].height)
    );

    setTextInputs((prevState) => ({
      ...prevState,
      [key]: { ...prevState[key], x: newX, y: newY },
    }));
  };

  const handleResize = (event, { size }, key) => {
    const newWidth = Math.min(size.width, canvasDimensions.width);
    const newHeight = Math.min(size.height, canvasDimensions.height);

    setTextInputs((prevState) => ({
      ...prevState,
      [key]: {
        ...prevState[key],
        width: newWidth,
        height: newHeight,
        x: Math.min(prevState[key].x, canvasDimensions.width - newWidth),
        y: Math.min(prevState[key].y, canvasDimensions.height - newHeight),
      },
    }));
  };

  const resolution = getCanvasDimensions();

  return (
    <div>
      {isCropping ? (
        <Demo
          selectedImage={selectedImage}
          onCrop={handleCroppedImage}
          selectedSocialMedia={selectedSocialMedia}
          resolution={resolution}
          cropperRef={cropperRef}
        />
      ) : (
        <div
          ref={containerRef}
          className="relative mx-auto border mt-4 w-[350px] bg-white"
        >
          <button
            className={`bg-red-500 p-2 rounded-lg ${
              !selectedImage && "cursor-not-allowed"
            }`}
            onClick={handleCropButtonClick}
            disabled={!selectedImage}
          >
            Reposition
          </button>
          <canvas ref={canvasRef} className="w-full h-full" />
          <div
            className="absolute top-10 bottom-0 left-0 w-full h-full"
            style={{ pointerEvents: "none", zIndex: 1 }}
          >
            {Object.keys(textInputs).map(
              (key) =>
                activeTextInput[key] && (
                  <Draggable
                    key={key}
                    position={{ x: textInputs[key].x, y: textInputs[key].y }}
                    onDrag={(e, data) => handleDrag(e, data, key)}
                    bounds="parent"
                  >
                    <ResizableBox
                      width={textInputs[key].width}
                      height={textInputs[key].height}
                      minConstraints={[50, 20]}
                      maxConstraints={[canvasDimensions.width, 100]}
                      onResize={(e, data) => handleResize(e, data, key)}
                    >
                      <div
                        className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-transparent border border-dashed border-white"
                        style={{
                          fontSize: `${textInputs[key].fontSize}px`,
                          color: "white",
                          pointerEvents: "auto",
                          zIndex: 2,
                          lineHeight: `${textInputs[key].fontSize}px`,
                          textAlign: "center",
                        }}
                        contentEditable
                        suppressContentEditableWarning
                        onInput={(e) =>
                          handleTextChange(key, e.currentTarget.textContent)
                        }
                      >
                        {textInputs[key].text}
                      </div>
                    </ResizableBox>
                  </Draggable>
                )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;
