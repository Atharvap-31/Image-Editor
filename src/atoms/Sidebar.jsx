import React, { useState } from "react";

const Sidebar = ({
  handleDownload,
  handleTextInputToggle,
  setSelectedSocialMedia,
  selectedSocialMedia,
  filter,
  setFilter,
  activeTextInput,
  handleTextStyleChange,
  handleImageUpload,
  setTextInputs,
}) => {
  const [selectedTextArea, setSelectedTextArea] = useState("header");
  const [selectedFormat, setSelectedFormat] = useState("png");

  const resetTextInputs = () => {
    setTextInputs({
      header: {
        text: "",
        x: 120,
        y: 50,
        width: 150,
        height: 40,
        fontSize: 24,
        visible: true,
      },
      body: {
        text: "",
        x: 20,
        y: 40,
        width: 150,
        height: 40,
        fontSize: 18,
        visible: true,
      },
      caption: {
        text: "",
        fontSize: 16,
        color: "#white",
        bold: false,
        width: 150,
        height: 40,
        x: 20,
        y: 40,
        visible: true,
      },
    });
  };

  const handleSocialMediaChange = (e) => {
    setSelectedSocialMedia(e.target.value);
    resetTextInputs();
  };

  return (
    <div className="ml-auto bg-gray-200 p-4 border-l border-gray-300">
      <div className="flex justify-center items-center my-4">
        <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded">
          Upload Image
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </div>
      <div className="p-4 bg-gray-100">
        <div>
          <label>Select Text Area:</label>
          <select
            value={selectedTextArea}
            onChange={(e) => setSelectedTextArea(e.target.value)}
            className="mb-4 w-full p-2 border border-gray-300 rounded"
          >
            <option value="header">Header</option>
            <option value="body">Body</option>
            <option value="caption">Caption</option>
          </select>
        </div>
        <div>
          <label>Font Size:</label>
          <input
            type="number"
            min="10"
            max="100"
            onChange={(e) =>
              handleTextStyleChange(
                "fontSize",
                parseInt(e.target.value),
                selectedTextArea
              )
            }
          />
        </div>
        <div>
          <label>Text Color:</label>
          <input
            type="color"
            onChange={(e) =>
              handleTextStyleChange("color", e.target.value, selectedTextArea)
            }
          />
        </div>
        <div>
          <label>Bold:</label>
          <input
            type="checkbox"
            onChange={(e) =>
              handleTextStyleChange("bold", e.target.checked, selectedTextArea)
            }
          />
        </div>
        {/* Existing sidebar content */}
      </div>

      <h2 className="text-lg mb-2">Social Media Options</h2>
      <select
        value={selectedSocialMedia}
        onChange={handleSocialMediaChange}
        className="mb-4 w-full p-2 border border-gray-300 rounded"
      >
        <option value="instagram">Instagram</option>
        <option value="pinterest">Pinterest</option>
        <option value="facebook">Facebook</option>
      </select>

      <div className="mt-4">
        <h2 className="text-lg mb-2">Filters</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="block w-full p-2 border border-gray-300 rounded z-0"
        >
          <option value="none">None</option>
          <option value="grayscale(100%)">Grayscale</option>
          <option value="sepia(100%)">Sepia</option>
          <option value="blur(5px)">Blur</option>
          <option value="brightness(0.5)">Brightness</option>
          <option value="contrast(200%)">Contrast</option>
        </select>
      </div>

      <div className="mt-4">
        <h2 className="text-lg mb-2">Download Format</h2>
        <select
          value={selectedFormat}
          onChange={(e) => setSelectedFormat(e.target.value)}
          className="mb-4 w-full p-2 border border-gray-300 rounded"
        >
          <option value="png">PNG</option>
          <option value="jpeg">JPEG</option>
          <option value="webp">WEBP</option>
        </select>
      </div>

      <div className="flex flex-col mt-5">
        <button
          onClick={() => handleTextInputToggle("header")}
          className={`mb-2 p-2 ${
            activeTextInput.header ? "bg-green-500" : "bg-gray-500"
          } text-white rounded`}
        >
          {activeTextInput.header ? " Disable Header" : "Enable Header"}
        </button>
        <button
          onClick={() => handleTextInputToggle("body")}
          className={`mb-2 p-2 ${
            activeTextInput.body ? "bg-green-500" : "bg-gray-500"
          } text-white rounded`}
        >
          {activeTextInput.body ? "Disable Body" : "Enable Body"}
        </button>
        <button
          onClick={() => handleTextInputToggle("caption")}
          className={`p-2 ${
            activeTextInput.caption ? "bg-green-500" : "bg-gray-500"
          } text-white rounded`}
        >
          {activeTextInput.caption ? " Disable Caption" : "Enable Caption"}
        </button>
      </div>

      <button
        onClick={() => handleDownload(selectedFormat)}
        className="p-2 w-full my-10 bg-green-500 text-white rounded"
      >
        Download
      </button>
    </div>
  );
};

export default Sidebar;
