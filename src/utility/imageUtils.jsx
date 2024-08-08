// src/utils/imageUtils.js
export const getCanvasDimensions = (selectedSocialMedia) => {
  switch (selectedSocialMedia) {
    case "instagram":
      return { width: 300, height: 300 };
    case "pinterest":
      return { width: 300, height: 450 };
    case "facebook":
      return { width: 400, height: 157 };
    default:
      return { width: 300, height: 300 };
  }
};

export const renderImage = (canvas, imageSrc, filter, textInputs, callback) => {
  const ctx = canvas.getContext("2d");
  const img = new Image();
  img.src = imageSrc;

  img.onload = () => {
    const containerWidth = canvas.width;
    const containerHeight = canvas.height;

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

    // Render text inputs
    for (const [key, input] of Object.entries(textInputs)) {
      if (input.visible) {
        ctx.font =
          key === "header"
            ? "bold 24px Arial"
            : key === "body"
            ? "18px Arial"
            : "italic 16px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(input.text, input.x - xOffset, input.y - yOffset);
      }
    }

    if (callback) {
      callback();
    }
  };
};
