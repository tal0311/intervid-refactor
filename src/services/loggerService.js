import httpService from "./httpService";
import store from "@/store";

const BASE_URL = "record";
const STORAGE_LOGS = "storageLogs";
let gLogs = [];
let gTimeout;

export const loggerService = {
  debug(...line) {
    doLog("DEBUG", ...line);
  },
  info(...line) {
    doLog("INFO", ...line);
  },
  warn(...line) {
    doLog("WARN", ...line);
  },
  error(...line) {
    doLog("ERROR", ...line);
  },
};

function doLog(level = "DEBUG", ...lines) {
  const line = _formatLines(lines);
  const log = _createLog(level, line);
  if (process.env.VUE_APP_ENV !== "production") console.log(...lines);
  if (level !== "DEBUG") gLogs.push(log);
  clearTimeout(gTimeout);
  if (gLogs.length > 10) return _sendLogs();
  gTimeout = setTimeout(_sendLogs, 500);
}

async function _sendLogs() {
  const storageLogs = _loadFromStorage(STORAGE_LOGS);
  if (storageLogs && storageLogs.length) gLogs = gLogs.concat(storageLogs);
  const logs = [...gLogs];
  try {
    if (gLogs.length) {
      gLogs = [];
      await httpService.post(BASE_URL, logs);
      _removeFromStorage(STORAGE_LOGS);
    }
  } catch (err) {
    _saveLogsToStorage(logs, err);
    gLogs = [];
  }
}

function _createLog(level, line) {
  const applicant = store.getters["applicant/applicant"];
  const user = store.getters["user/loggedInUser"];
  const log = {
    level,
    timestamp: Date.now(),
    message: line,
    meta: {
      source: "frontend",
      stack: new Error().stack.substring(10),
      referrer: window.location.href,
      enviroment: process.env.VUE_APP_ENV,
      browser: store.getters["app/browser"].name,
    },
  };

  if (applicant?.id) {
    const { id, info } = applicant;
    log.meta.applicant = { id, info };
  } else if (user?._id) {
    const { _id, fName, lName, companyName, email, perm, role } = user;
    log.meta.user = { _id, fName, lName, companyName, email, perm, role };
  }
  return log;
}

function _formatLines(lines) {
  return lines
    .map((line) => {
      if (line instanceof Error) return line.toString();
      if (typeof line !== "string") return JSON.stringify(line);
      return line;
    })
    .join(" | ");
}

function _loadFromStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : undefined;
}

function _saveLogsToStorage(logs) {
  _saveToStorage(STORAGE_LOGS, logs);
}

function _saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value) || null);
}

function _removeFromStorage(key) {
  localStorage.removeItem(key);
}
