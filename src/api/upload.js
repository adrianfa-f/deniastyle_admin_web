import client from "./client";

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const response = await client.post("/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
