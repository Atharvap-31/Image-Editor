import React from "react";

const Sidebar = ({
  handleDownload,
  handleTextInputToggle,
  setSelectedSocialMedia,
  selectedSocialMedia,
  filter,
  setFilter,
  activeTextInput,
}) => {
  return (
    <div className="w-1/4 bg-gray-200 p-4 border-l border-gray-300">
      <h2 className="text-lg mb-2">Social Media Options</h2>
      <select
        value={selectedSocialMedia}
        onChange={(e) => setSelectedSocialMedia(e.target.value)}
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
          className="block w-full p-2 border border-gray-300 rounded"
        >
          <option value="none">None</option>
          <option value="grayscale(100%)">Grayscale</option>
          <option value="sepia(100%)">Sepia</option>
          <option value="blur(5px)">Blur</option>
          <option value="brightness(0.5)">Brightness</option>
          <option value="contrast(200%)">Contrast</option>
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
          {activeTextInput.body ? " Disable Body" : "Enable Body"}
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
        onClick={handleDownload}
        className="p-2 w-full my-10 bg-green-500 text-white rounded"
      >
        Download
      </button>
    </div>
  );
};

export default Sidebar;
