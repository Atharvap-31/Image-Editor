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
