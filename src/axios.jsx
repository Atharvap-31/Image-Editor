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

export const getMorePhotos = async (page = 1, perPage = 30) => {
  const response = await unsplashApi.get("/photos", {
    params: { page, per_page: perPage },
  });
  return response.data;
};

export const searchUnsplashImages = async (query) => {
  try {
    const response = await axios.get("https://api.unsplash.com/search/photos", {
      params: { query, per_page: 10 },
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error fetching images from Unsplash:", error);
    return [];
  }
};

export const fetchPhotos = async () => {
  const result = await unsplash.photos.list({ page: 1, perPage: 30 });
  if (result.type === "success") {
    return result.response.results;
  }
  return [];
};

// const handleSearch = () => {
//   if (searchTerm.trim() === "") {
//     setFilteredImageUrls(imageUrls);
//   } else {
//     const filteredImages = imageUrls.filter(
//       (image) =>
//         image.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         image.description.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredImageUrls(filteredImages);
//   }
// };

// useEffect(() => {
//   const fetchImages = async () => {
//     try {
//       const images = await getMorePhotos();

//       const formattedImages = images.map((image) => ({
//         url: image.urls.small,
//         description: image.description || image.alt_description || "",
//       }));

//       setImageUrls(formattedImages);
//       setFilteredImageUrls(formattedImages);
//     } catch (error) {
//       console.error("Error fetching images from Unsplash", error);
//     }
//   };

//   fetchImages();
// }, []);
