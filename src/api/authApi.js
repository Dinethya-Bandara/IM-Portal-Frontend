import axios from "axios";

const BASE_URL = "http://localhost:8080";

export async function login(email, password) {

  const res = await axios.post(
    `${BASE_URL}/api/users/login`,
    { email, password }, 
    { headers: { "Content-Type": "application/json" } }
  );

  return res.data; 
}
