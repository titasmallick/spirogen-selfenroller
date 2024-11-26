import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Define the payload
const payload = {
  uid: "titasmallick",
  role: "admin",
};

const secretKey = process.env.JWT_SECRET;

// Generate the JWT
const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
console.log("Generated JWT Token:", token);

// Function to make the POST request
const makeRequest = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/selfenroll", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        uid: "QNlB8WTgxeh8l28nvtxRoQJR6L72",
      }),
    });

    // Parse the response JSON
    const data = await response.json();
    console.log("Server Response:", data);
  } catch (error) {
    console.error("Error making request:", error);
  }
};

// Call the function
makeRequest();



//CURL KIND OF LOOKS LIKE THAT
// curl -X POST http://localhost:3000/api/selfenroll -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJXZGxDTGp6Wmw2ZTZaU0NDSXp1OXlXRUtCUWwxIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzMyNTU4MDg1LCJleHAiOjE3MzI1NjE2ODV9.YZLSTFVG6w2Hc55OhwLhCzO2s5YoNOA44YeUh7nyFCc" -d "{\"uid\":\"QNlB8WTgxeh8l28nvtxRoQJR6L72\"}"
