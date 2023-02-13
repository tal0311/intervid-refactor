import {
  isEmailValid,
  isPhoneValid,
  isPasswordValid,
} from "@/services/utilService";
import { detect } from "detect-browser";

const browser = detect();

export const browserErrorMap = {
  NO_BROWSER_SUPPORT: {
    type: "NO_BROWSER_SUPPORT",
    desc: true,
  },
  NO_VERSION_SUPPORT: {
    type: "NO_VERSION_SUPPORT",
    desc: true,
  },
};

export const screenErrorMap = {
  DENIED_SCREEN_ACCESS: {
    type: "DENIED_SCREEN_ACCESS",
    desc: true,
    device: "screen",
    reload: "share-screen",
    isBlocking: true,
  },
  SAFARI_SCREEN_SHARE: {
    type: "SAFARI_SCREEN_SHARE",
    desc: true,
    device: "screen",
    isBlocking: false,
  },
};

export const videoErrorTypes = [
  "CAMERA_BUSY",
  "DENIED_CAM_ACCESS",
  "CAMERA_NOT_FOUND",
  "MEDIA_DENIED_BY_SYSTEM",
];

export const videoErrorMap = {
  CAMERA_BUSY: {
    type: "CAMERA_BUSY",
    desc: true,
    device: "camera",
    reload: "reload-camera",
    isBlocking: true,
  },

  DENIED_CAM_ACCESS: {
    type: "DENIED_CAM_ACCESS",
    desc: true,
    device: "camera",
    isBlocking: true,
    reload: browser.name === "safari" ? "reload-camera" : false,
  },

  DENIED_MIC_ACCESS: {
    type: "DENIED_MIC_ACCESS",
    device: "microphone",
    desc: true,
    isBlocking: true,
  },

  CAMERA_NOT_FOUND: {
    type: "CAMERA_NOT_FOUND",
    desc: true,
    device: "camera",
    isBlocking: true,
  },

  MEDIA_DENIED_BY_SYSTEM: {
    type: "MEDIA_DENIED_BY_SYSTEM",
    reload: "try-again",
    isBlocking: true,
  },

  MIC_NOT_FOUND: {
    type: "MIC_NOT_FOUND",
    device: "microphone",
    desc: true,
    isBlocking: true,
  },

  MIC_LOW_VOLUME: {
    type: "MIC_LOW_VOLUME",
    device: "microphone",
    desc: false,
    isBlocking: true,
  },

  NOT_RECOGNIZED: {
    type: "NOT_RECOGNIZED",
    // reload: 'scan-again',
    device: "camera",
    isBlocking: true,
  },

  NO_NETWORK: {
    type: "NO_NETWORK",
    device: "connection",
    isBlocking: true,
  },

  NETWORK_UNSTABLE: {
    type: "NETWORK_UNSTABLE",
    device: "connection",
    isBlocking: false,
  },
};

export const getErr = (err) => {
  if (!err.response) {
    err.msg = "NETWORK_ERR";
    err.statusCode = 500;
    return err;
  }
  const errName = err.response.data;
  const statusCode = err.response.status;
  const errMsg = { statusCode, msg: `${errName}_ERR` };
  return errMsg;
};

export const validate = (els) => {
  const errors = [];
  els = [...els];
  els.forEach((el) => {
    const validator = el.attributes.validate?.value;
    if (!validator) return;
    if (validator.includes("required") && !el.value) {
      errors.push(getValidateMsg("REQUIRED", el));
    }
    if (
      validator.includes("range") &&
      (+el.min > +el.value || +el.max < +el.value)
    ) {
      errors.push(getValidateMsg("OUT_OF_RANGE", el));
    }
    if (validator.includes("email") && !isEmailValid(el.value)) {
      errors.push(getValidateMsg("EMAIL", el));
    }
    if (validator.includes("phone") && !isPhoneValid(el.value)) {
      errors.push(getValidateMsg("PHONE", el));
    }
    if (validator.includes("password") && !isPasswordValid(el.value)) {
      errors.push(getValidateMsg("PASSWORD", el));
    }
  });
  return errors;
};

export const getValidateMsg = (errName, el) => {
  return {
    msg: errName + "_VALIDATE",
    elName: el.name,
  };
};
