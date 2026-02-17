// import { io } from "socket.io-client";
// let API_URL;

// // runtime check
// if (window.location.hostname === "localhost") {
//   API_URL = "http://localhost:4000";
// } else {
//   API_URL = "https://restaurant-management-yovo.onrender.com";
// }

// console.log("Using API URL:", API_URL);
// const socket = io(API_URL);

// export default socket;




import { io } from "socket.io-client";

let API_URL;

if (window.location.hostname === "localhost") {
  API_URL = "http://localhost:4000";
} else {
  API_URL = "https://restaurant-management-yovo.onrender.com";
}

console.log("Using API URL:", API_URL);

const socket = io(API_URL, {
  withCredentials: true,
  transports: ["websocket"]
});

// 🔥 Connection status logging
socket.on("connect", () => {
  console.log("✅ Socket connected successfully:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("❌ Socket disconnected:", reason);
});

socket.on("connect_error", (error) => {
  console.log("❌ Socket connection error:", error);
});

export default socket;