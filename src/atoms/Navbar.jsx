import React, { useEffect, useRef, useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import { saveAs } from "file-saver";
import Main from "../components/Main";
import Sidebar from "./Sidebar";
import { IMAGES, RESOLUTIONS } from "../utility/constant";
import { getMorePhotos, getRandomPhotos, searchUnsplashImages } from "../axios";

const Navbar = () => {
  const [showImages, setShowImages] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSocialMedia, setSelectedSocialMedia] = useState("instagram");
  const [filteredImageUrls, setFilteredImageUrls] = useState([]);
  const [filter, setFilter] = useState("none");
  const [croppedImage, setCroppedImage] = useState(null);
  const [activeTextInput, setActiveTextInput] = useState({
    header: false,
    body: false,
    caption: false,
  });
  const [searchResults, setSearchResults] = useState([]);
  const [textStyle, setTextStyle] = useState({
    fontSize: 24,
    color: "white",
    bold: false,
  });

  const [imageUrls, setImageUrls] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const images = await getMorePhotos();

        setImageUrls(images);
        setFilteredImageUrls(images);
      } catch (error) {
        console.error("Error fetching images from Unsplash", error);
      }
    };

    fetchImages();
  }, []);

  const cropperRef = useRef(null);

  const [textInputs, setTextInputs] = useState({
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
      x: 20,
      y: 40,
      width: 150,
      height: 40,
      fontSize: 16,
      visible: true,
    },
  });

  const handleSearch = async () => {
    if (searchTerm.trim() !== "") {
      const results = await searchUnsplashImages(searchTerm);
      setFilteredImageUrls(results);
    } else {
      setFilteredImageUrls(imageUrls);
    }
  };

  const handleTextInputToggle = (inputName) => {
    setActiveTextInput((prevState) => ({
      ...prevState,
      [inputName]: !prevState[inputName],
    }));
  };

  const handleTextStyleChange = (styleType, value, key) => {
    setTextInputs((prevState) => ({
      ...prevState,
      [key]: {
        ...prevState[key],
        [styleType]: value,
      },
    }));
  };

  const handleDownload = (format) => {
    if (selectedImage && selectedSocialMedia) {
      fetch(selectedImage)
        .then((response) => response.blob())
        .then((blob) => createImageFromBlob(blob))
        .then((image) => {
          const { width, height } = RESOLUTIONS[selectedSocialMedia];

          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = width;
          canvas.height = height;

          const cropper = cropperRef.current?.cropper;
          if (cropper) {
            const cropData = cropper.getData();

            const sx = cropData.x;
            const sy = cropData.y;
            const sWidth = cropData.width;
            const sHeight = cropData.height;

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

          Object.keys(textInputs).forEach((key) => {
            const textInput = textInputs[key];
            if (textInput.visible) {
              ctx.save();
              ctx.filter = "none";
              ctx.font = `${textInput.bold ? "bold" : "normal"} ${
                textInput.fontSize || "16"
              }px Arial`;
              ctx.fillStyle = textInput.color || "white";
              (activeTextInput.header ||
                activeTextInput.body ||
                activeTextInput.caption) &&
                ctx.fillText(
                  textInput.text,
                  RESOLUTIONS.instagram
                    ? textInput.x + 50
                    : RESOLUTIONS.pinterest
                    ? textInput.x + 55
                    : RESOLUTIONS.facebook && textInput.x + 80,
                  RESOLUTIONS.instagram
                    ? textInput.y + textStyle.fontSize + 40
                    : RESOLUTIONS.pinterest
                    ? textInput.y + textStyle.fontSize + 100
                    : RESOLUTIONS.facebook &&
                      textInput.y + textStyle.fontSize + 100
                );
            }
          });

          canvas.toBlob((blob) => {
            if (blob) {
              saveAs(blob, `image-${selectedSocialMedia}.${format}`);
            } else {
              alert("Failed to generate the image.");
            }
          }, `image/${format}`);
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

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
        setCroppedImage(null);
      };
      reader.readAsDataURL(file);
    }
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
            className="absolute top-[60px] left-1/2 transform -translate-x-1/2 w-[1300px] h-52 bg-white p-4 rounded shadow-lg flex justify-center items-center overflow-x-scroll z-20"
          >
            {IMAGES?.map((image, i) => (
              <img
                key={i}
                src={image.url}
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

      <div className="flex flex1">
        <div className="flex-1 flex flex-col">
          <div className="flex ">
            <div className="flex flex-col p-4 w-[300px]">
              <h2 className="text-lg mb-2">Images</h2>
              <div className="mb-4">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search Images"
                  className="w-full p-2 border-b border-gray-300"
                />
                <button
                  onClick={handleSearch}
                  className="px-5 py-2 mt-2 bg-blue-500 text-white rounded-lg"
                >
                  Search
                </button>
              </div>
              <div className="flex flex-col space-y-2 overflow-y-scroll h-[500px]">
                {filteredImageUrls?.map((image, i) => (
                  <img
                    key={i}
                    src={image.urls.small}
                    alt={`Image ${i + 1}`}
                    className={`w-32 h-32 object-cover mr-2 cursor-pointer ${
                      selectedImage === image && "border-4 border-blue-500"
                    }`}
                    onClick={() => {
                      setSelectedImage(image.urls.small);
                      setCroppedImage(null);
                    }}
                  />
                ))}
              </div>
            </div>
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
                textStyle={textStyle}
                resolution={RESOLUTIONS}
              />
            </div>
          </div>
        </div>
        <Sidebar
          handleDownload={handleDownload}
          handleTextInputToggle={handleTextInputToggle}
          setSelectedSocialMedia={setSelectedSocialMedia}
          selectedSocialMedia={selectedSocialMedia}
          setFilter={setFilter}
          filter={filter}
          activeTextInput={activeTextInput}
          handleTextStyleChange={handleTextStyleChange}
          handleImageUpload={handleImageUpload}
          setTextInputs={setTextInputs}
          textInputs={textInputs}
        />
      </div>
    </div>
  );
};

export default Navbar;
