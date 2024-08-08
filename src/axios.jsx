import axios from "axios";

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

if (!UNSPLASH_ACCESS_KEY) {
  throw new Error(
    "Unsplash Access Key is not defined in the environment variables."
  );
}

const unsplashApi = axios.create({
  baseURL: "https://api.unsplash.com",
  headers: {
    Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
  },
});

export const searchPhotos = async (query) => {
  const response = await unsplashApi.get("/search/photos", {
    params: { query, per_page: 10 },
  });
  return response.data.results;
};

export const getRandomPhotos = async () => {
  const response = await unsplashApi.get("/photos/random", {
    params: { count: 20 },
  });
  return response.data;
};

// const images = [
//   "https://images.unsplash.com/photo-1512850183-6d7990f42385?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   "https://images.unsplash.com/photo-1526312426976-f4d754fa9bd6?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   "https://media.istockphoto.com/id/133869084/photo/assorted-gold-frames.jpg?s=612x612&w=0&k=20&c=jfLw1Hlxzd34kO-jKbh_60dKEl7WGBz-_odc2SHfkGI=",
//   "https://images.pexels.com/photos/33045/lion-wild-africa-african.jpg?auto=compress&cs=tinysrgb&w=600",
//   "https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=600",
//   "https://i.pinimg.com/736x/1a/79/89/1a798991a56d1f3f524a1856b4dae6e9.jpg",
// ];

// const [imageUrls, setImageUrls] = useState([]);

// useEffect(() => {
//   const fetchImages = async () => {
//     try {
//       const images = await getRandomPhotos();
//       setImageUrls(images.map((image) => image.urls.small));
//     } catch (error) {
//       console.error("Error fetching images from Unsplash", error);
//     }
//   };

//   fetchImages();
// }, []);

// const handleDownload = () => {
//   if (selectedImage && selectedSocialMedia) {
//     fetch(selectedImage)
//       .then((response) => response.blob())
//       .then((blob) => createImageFromBlob(blob))
//       .then((image) => {
//         // Retrieve resolution from the selected social media
//         const { width, height } = resolutions[selectedSocialMedia];

//         // Create a canvas with the selected resolution
//         const canvas = document.createElement("canvas");
//         const ctx = canvas.getContext("2d");
//         canvas.width = width;
//         canvas.height = height;

//         // Calculate aspect ratio and adjust image dimensions
//         const imageAspectRatio = image.width / image.height;
//         let newWidth, newHeight;
//         let xOffset, yOffset;

//         if (imageAspectRatio > width / height) {
//           newHeight = height;
//           newWidth = imageAspectRatio * height;
//         } else {
//           newWidth = width;
//           newHeight = width / imageAspectRatio;
//         }

//         xOffset = (width - newWidth) / 2;
//         yOffset = (height - newHeight) / 2;

//         // Clear canvas and draw image centered
//         ctx.clearRect(0, 0, width, height);
//         ctx.drawImage(image, xOffset, yOffset, newWidth, newHeight);

//         // Apply filter if any
//         if (filter) {
//           ctx.filter = filter;
//           ctx.drawImage(image, xOffset, yOffset, newWidth, newHeight);
//         }

//         // Draw text if enabled
//         if (activeTextInput.header && activeTextInput.header.visible) {
//           ctx.font = "30px Arial";
//           ctx.fillStyle = "white";
//           ctx.fillText(
//             activeTextInput.header.text,
//             activeTextInput.header.x - xOffset, // Adjust for offset
//             activeTextInput.header.y - yOffset // Adjust for offset
//           );
//         }
//         if (activeTextInput.body && activeTextInput.body.visible) {
//           ctx.font = "20px Arial";
//           ctx.fillStyle = "white";
//           ctx.fillText(
//             activeTextInput.body.text,
//             activeTextInput.body.x - xOffset, // Adjust for offset
//             activeTextInput.body.y - yOffset // Adjust for offset
//           );
//         }
//         if (activeTextInput.caption && activeTextInput.caption.visible) {
//           ctx.font = "15px Arial";
//           ctx.fillStyle = "white";
//           ctx.fillText(
//             activeTextInput.caption.text,
//             activeTextInput.caption.x - xOffset, // Adjust for offset
//             activeTextInput.caption.y - yOffset // Adjust for offset
//           );
//         }

//         // Convert canvas to blob and trigger download
//         canvas.toBlob((blob) => {
//           if (blob) {
//             saveAs(blob, `image-${selectedSocialMedia}.png`);
//           } else {
//             alert("Failed to generate the image.");
//           }
//         }, "image/png");
//       })
//       .catch((error) => {
//         console.error("Error during download:", error);
//         alert("Failed to download the image.");
//       });
//   }
// };
