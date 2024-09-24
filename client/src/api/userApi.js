import axios from "axios";

export const fetchUsers = async () => {
  const res = await axios.get("http://localhost:3000/api/v1/users");
  return res.data;
};