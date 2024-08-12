import React, { useState, useEffect, useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const Demo = ({
  selectedImage,
  onCrop,
  selectedSocialMedia,
  resolution,
  cropperRef,
}) => {
  const [image, setImage] = useState(selectedImage);
  const [zoom, setZoom] = useState(0);
  const [croppedImage, setCroppedImage] = useState(null);

  useEffect(() => {
    if (!croppedImage) {
      setImage(selectedImage);
      resetCropper();
    }
  }, [selectedImage]);

  useEffect(() => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.reset();
      setCropBoxSize();
    }
  }, [resolution]);

  const resetCropper = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.reset();
      setZoom(0);
    }
  };

  const setCropBoxSize = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const { width, height } = resolution;
      cropper.setCropBoxData({
        width,
        height,
        left: (cropper.getContainerData().width - width) / 2,
        top: (cropper.getContainerData().height - height) / 2,
      });
    }
  };

  const getAspectRatio = () => {
    switch (selectedSocialMedia) {
      case "instagram":
        return 400 / 300;
      case "pinterest":
        return 400 / 450;
      case "facebook":
        return 500 / 250;
      default:
        return 16 / 9;
    }
  };
  const handleCropData = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const croppedCanvas = cropper.getCroppedCanvas({
        width: resolution.width,
        height: resolution.height,
      });

      const croppedImage = croppedCanvas.toDataURL();
      setCroppedImage(croppedImage);
      onCrop(croppedImage);
    }
  };

  const handleZoomChange = (e) => {
    const zoomValue = parseFloat(e.target.value);
    setZoom(zoomValue);
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.zoomTo(zoomValue);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow-lg relative w-full max-w-3xl">
        <div style={{ width: "100%", marginBottom: "10px" }}>
          <Cropper
            ref={cropperRef}
            style={{ height: 400, width: "100%" }}
            src={image}
            aspectRatio={getAspectRatio()}
            zoomTo={zoom}
            viewMode={1}
            background={false}
            responsive={false}
            autoCropArea={1}
            checkOrientation={false}
            guides={true}
            zoomOnWheel={false}
            zoomOnTouch={true}
            movable={true}
            cropBoxMovable={true}
            cropBoxResizable={false}
            dragMode="move"
          />
        </div>
        <div className="flex items-center justify-between">
          <label htmlFor="zoom-range" className="mr-2">
            Zoom:
          </label>
          <input
            id="zoom-range"
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={zoom}
            onChange={handleZoomChange}
            className="w-full"
          />
        </div>
        <div className="flex items-center justify-between mt-4">
          <button
            className="bg-blue-500 p-2 rounded-lg text-white"
            onClick={handleCropData}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default Demo;
