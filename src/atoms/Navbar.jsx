import React, { useRef, useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import { saveAs } from "file-saver";
import Main from "../components/Main";
import Sidebar from "./Sidebar";
import { IMAGES, RESOLUTIONS } from "../utility/constant";

const Navbar = () => {
  const [showImages, setShowImages] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSocialMedia, setSelectedSocialMedia] = useState("instagram");
  const [filter, setFilter] = useState("none");
  const [croppedImage, setCroppedImage] = useState(null);
  const [activeTextInput, setActiveTextInput] = useState({
    header: true,
    body: true,
    caption: true,
  });
  const cropperRef = useRef(null);

  const [textInputs, setTextInputs] = useState({
    header: {
      text: "",
      x: 20,
      y: 40,
      width: 150,
      height: 40,
      fontSize: 24,
      visible: true,
    },
    body: {
      text: "",
      x: 20,
      y: 0,
      width: 150,
      height: 30,
      fontSize: 18,
      visible: true,
    },
    caption: {
      text: "",
      x: 20,
      y: 20,
      width: 150,
      height: 30,
      fontSize: 16,
      visible: true,
    },
  });

  const handleTextInputToggle = (inputName) => {
    setActiveTextInput((prevState) => ({
      ...prevState,
      [inputName]: !prevState[inputName],
    }));
  };

  const handleDownload = () => {
    if (selectedImage && selectedSocialMedia) {
      fetch(selectedImage)
        .then((response) => response.blob())
        .then((blob) => createImageFromBlob(blob))
        .then((image) => {
          // Retrieve resolution from the selected social media
          const { width, height } = RESOLUTIONS[selectedSocialMedia];

          // Create a canvas with the selected resolution
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = width;
          canvas.height = height;

          const cropper = cropperRef.current?.cropper;
          if (cropper) {
            // Get the cropped box details
            const cropBoxData = cropper.getCropBoxData();
            const cropData = cropper.getData();

            // Calculate the source dimensions and offsets
            const sx = cropData.x;
            const sy = cropData.y;
            const sWidth = cropData.width;
            const sHeight = cropData.height;

            // Calculate aspect ratio and adjust image dimensions
            const imageAspectRatio = sWidth / sHeight;
            let newWidth, newHeight;
            let xOffset, yOffset;

            if (imageAspectRatio > width / height) {
              newHeight = height;
              newWidth = imageAspectRatio * height;
            } else {
              newWidth = width;
              newHeight = width / imageAspectRatio;
            }

            xOffset = (width - newWidth) / 2;
            yOffset = (height - newHeight) / 2;

            // Clear canvas and draw cropped image centered
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(
              image,
              sx,
              sy,
              sWidth,
              sHeight,
              xOffset,
              yOffset,
              newWidth,
              newHeight
            );

            // Apply filter if any
            if (filter) {
              ctx.filter = filter;
              ctx.drawImage(
                image,
                sx,
                sy,
                sWidth,
                sHeight,
                xOffset,
                yOffset,
                newWidth,
                newHeight
              );
            }
          } else {
            // No cropper instance, draw the full image
            const imageAspectRatio = image.width / image.height;
            let newWidth, newHeight;
            let xOffset, yOffset;

            if (imageAspectRatio > width / height) {
              newHeight = height;
              newWidth = imageAspectRatio * height;
            } else {
              newWidth = width;
              newHeight = width / imageAspectRatio;
            }

            xOffset = (width - newWidth) / 2;
            yOffset = (height - newHeight) / 2;

            // Clear canvas and draw full image centered
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(
              image,
              0,
              0,
              image.width,
              image.height,
              xOffset,
              yOffset,
              newWidth,
              newHeight
            );

            // Apply filter if any
            if (filter) {
              ctx.filter = filter;
              ctx.drawImage(
                image,
                0,
                0,
                image.width,
                image.height,
                xOffset,
                yOffset,
                newWidth,
                newHeight
              );
            }
          }

          // Draw text if enabled
          Object.keys(activeTextInput).forEach((key) => {
            if (activeTextInput[key] && textInputs[key].visible) {
              const textInput = textInputs[key];
              ctx.font = `${textInput.fontSize}px Arial`;
              ctx.fillStyle = "white";
              ctx.fillText(textInput.text, textInput.x, textInput.y);
            }
          });

          // Convert canvas to blob and trigger download
          canvas.toBlob((blob) => {
            if (blob) {
              saveAs(blob, `image-${selectedSocialMedia}.png`);
            } else {
              alert("Failed to generate the image.");
            }
          }, "image/png");
        })
        .catch((error) => {
          console.error("Error during download:", error);
          alert("Failed to download the image.");
        });
    }
  };

  const createImageFromBlob = (blob) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(blob);
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = reject;
      img.src = url;
    });
  };

  return (
    <div className="flex flex-col">
      <div className="relative">
        <div className="text-blue-500 flex justify-center items-center text-lg h-[60px] border border-b rounded shadow-lg">
          <div
            onMouseEnter={() => setShowImages(true)}
            onMouseLeave={() => setShowImages(false)}
            className="flex justify-between items-center cursor-pointer h-[60px]"
          >
            <button>Templates</button>
            <FaAngleDown className="mt-1 ml-1" />
          </div>
        </div>
        {showImages && (
          <div
            onMouseEnter={() => setShowImages(true)}
            onMouseLeave={() => setShowImages(false)}
            className={`absolute top-[60px] left-1/2 transform -translate-x-1/2 w-[1300px] h-52 bg-white p-4 rounded shadow-lg flex justify-center items-center overflow-x-scroll z-20`}
          >
            {IMAGES.map((image, i) => (
              <img
                key={i}
                src={image}
                alt={`Image ${i + 1}`}
                className={`w-32 h-32 object-cover mr-2 cursor-pointer ${
                  selectedImage === image && "border-4 border-blue-500"
                }`}
                onClick={() => {
                  setSelectedImage(image);

                  setCroppedImage(null);
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-1">
        <div className="flex-1 flex flex-col">
          <Main
            selectedImage={selectedImage}
            selectedSocialMedia={selectedSocialMedia}
            filter={filter}
            activeTextInput={activeTextInput}
            setCroppedImage={setCroppedImage}
            croppedImage={croppedImage}
            textInputs={textInputs}
            setTextInputs={setTextInputs}
            cropperRef={cropperRef}
          />
        </div>
        <Sidebar
          handleDownload={handleDownload}
          handleTextInputToggle={handleTextInputToggle}
          setSelectedSocialMedia={setSelectedSocialMedia}
          selectedSocialMedia={selectedSocialMedia}
          filter={filter}
          setFilter={setFilter}
          activeTextInput={activeTextInput}
        />
      </div>
    </div>
  );
};

export default Navbar;
