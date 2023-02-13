import config from "@/config";
import io from "socket.io-client";
import { userService } from "./userService";

const SOCKET_EMIT_USER_WATCH = "user watch";
export const SOCKET_ON_SAVE_APPLICANT = "save applicant";
export const SOCKET_EMIT_DONE_INTERVIEW = "interview done";
export const SOCKET_ON_DONE_INTERVIEW = "alert interview done";

export const socketService = createSocketService();

socketService.setup();

function createSocketService() {
  var socket = null;
  const socketService = {
    setup() {
      socket = io(config.backendUrl, { transports: ["websocket"] });
    },

    on(eventName, cb) {
      socket.on(eventName, cb);
    },

    off(eventName, cb = null) {
      if (!socket) return;
      if (!cb) socket.removeAllListeners(eventName);
      else socket.off(eventName, cb);
    },

    emit(eventName, data) {
      socket.emit(eventName, data);
    },

    async setUserWatch() {
      const { _id: userId } = await userService.getLoggedInUser();
      socket.emit(SOCKET_EMIT_USER_WATCH, userId);
    },

    terminate() {
      socket = null;
    },
  };
  return socketService;
}

export function getEmitData(type, job, applicant) {
  return {
    userId: job.owner._id.toString(),
    data: {
      type,
      applicant,
      jobId: job._id.toString(),
    },
  };
}
