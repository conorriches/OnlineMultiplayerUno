// import React, { createContext } from "react";
// import io from "socket.io-client";
// import { useDispatch } from "react-redux";
// import { updateChatLog } from "./actions";

// const WebSocketContext = createContext(null);

// export { WebSocketContext };

// export default ({ children }) => {
//   let socket;
//   let ws;

//   const dispatch = useDispatch();

//   const sendMessage = (roomId, message) => {
//     const payload = {
//       roomId: roomId,
//       data: message,
//     };
//     socket.emit("event://send-message", JSON.stringify(payload));
//     dispatch(updateChatLog(payload));
//   };

//   if (!socket) {
//     socket = io.connect("localhost:3030");

//     socket.on("PLAYER_ID", (obj) => {
//       localStorage.setItem("playerId", obj.playerId);
//     });

//     socket.on("GAME_STATE", (state) => {
//       state && dispatch({ type: "SET_STATE", state });
//     });

//     ws = {
//       socket: socket,
//       sendMessage,
//     };
//   }

//   return (
//     <WebSocketContext.Provider value={ws}>{children}</WebSocketContext.Provider>
//   );
// };
