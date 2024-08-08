import React, { createContext, useContext, useRef } from "react";

const ImageCaptureContext = createContext();

export const useImageCapture = () => useContext(ImageCaptureContext);

export const ImageCaptureProvider = ({ children }) => {
  const mainRef = useRef(null);

  return (
    <ImageCaptureContext.Provider value={{ mainRef }}>
      {children}
    </ImageCaptureContext.Provider>
  );
};
