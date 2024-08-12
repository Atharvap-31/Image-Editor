import React, { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import Demo from "./Demo";
import TextareaAutosize from "react-textarea-autosize";

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
  textStyle,
  resolution,
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
  }, [selectedSocialMedia]);

  useEffect(() => {
    if (croppedImage) {
      renderImage(croppedImage);
    } else {
      renderImage(selectedImage);
    }
  }, [
    selectedImage,
    filter,
    canvasDimensions,
    croppedImage,
    textInputs,
    textStyle,
  ]);

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
      const { width, height } = canvasDimensions;

      canvas.width = width;
      canvas.height = height;

      ctx.clearRect(0, 0, width, height);

      // Set image and filter properties
      const aspectRatio = img.width / img.height;
      let newWidth, newHeight;

      if (aspectRatio > width / height) {
        newHeight = height;
        newWidth = aspectRatio * height;
      } else {
        newWidth = width;
        newHeight = width / aspectRatio;
      }

      const xOffset = (width - newWidth) / 2;
      const yOffset = (height - newHeight) / 2;

      ctx.filter = filter;
      ctx.drawImage(img, xOffset, yOffset, newWidth, newHeight);
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
    setTextInputs((prevState) => ({
      ...prevState,
      [key]: {
        ...prevState[key],
        x: data.x,
        y: data.y,
      },
    }));
  };

  const handleResize = (event, { size }, key) => {
    setTextInputs((prevState) => ({
      ...prevState,
      [key]: {
        ...prevState[key],
        width: data.size.width,
        height: data.size.height,
      },
    }));
  };

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
            className="absolute top-0 bottom-0 left-0 w-full h-full"
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
                      <TextareaAutosize
                        className="absolute top-10 left-0 w-full h-full flex items-center justify-center bg-transparent border border-white"
                        style={{
                          fontSize: `${textStyle.fontSize}px`,
                          color: textStyle.color || "white",
                          fontWeight: textStyle.bold ? "bold" : "normal",
                          pointerEvents: "auto",
                          zIndex: 2,
                          textAlign: "center",
                          overflow: "hidden",
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                        }}
                        value={textInputs[key].text}
                        onChange={(e) => {
                          handleTextChange(key, [e.target.value]);
                        }}
                        minRows={1}
                        maxRows={10}
                      />
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
