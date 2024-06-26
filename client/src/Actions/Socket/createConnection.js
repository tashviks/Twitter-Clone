import io from "socket.io-client";
import { SOCKET_CONNECT, SOCKET_CONNECT_ERROR, SOCKET_CONNECT_SUCCESS } from "../../Constants/socketConstants";
import { errorHandler } from "../../utils/errorHandler";

/**
 * Creates a socket connection and sets up event listeners.
 * returns a funtion : The async function that creates the socket connection.
 */
export const createConnection = () => async (dispatch, getState) => {
  try {
    // get the user from state
    const { user } = getState().auth;
    const {
      socketConnection: { socket, isConnecting },
    } = getState().socket;
    if (socket || isConnecting || !user) return;
    dispatch({ type: SOCKET_CONNECT });
    const connection = io("/");
    await connection.on("connect", () => {
      dispatch({ type: SOCKET_CONNECT_SUCCESS, payload: connection });
      connection.emit("setup", user);
    });
  } catch (error) {
    errorHandler(error, dispatch, SOCKET_CONNECT_ERROR);
  }
};
