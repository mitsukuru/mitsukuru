import axios from "axios";

export const fetchPosts= async () => {
  const res = await axios.get("http://localhost:3000/api/v1/posts");
  return res.data;
};