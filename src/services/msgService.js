import { getAlertTrans } from "./i18nService";

export const msgService = {
  add(item) {
    return {
      type: "success",
      txt: getAlertTrans("add", item),
    };
  },

  failAdd(item) {
    return {
      type: "fail",
      txt: getAlertTrans("failAdd", item),
    };
  },

  update(item) {
    return {
      type: "success",
      txt: getAlertTrans("update", item),
    };
  },

  failUpdate(item) {
    return {
      type: "fail",
      txt: getAlertTrans("failUpdate", item),
    };
  },

  save(item) {
    return {
      type: "success",
      txt: getAlertTrans("save", item),
    };
  },

  failSave(item) {
    return {
      type: "fail",
      txt: getAlertTrans("failSave", item),
    };
  },

  start(item) {
    return {
      type: "success",
      txt: getAlertTrans("start", item),
    };
  },

  submit(item) {
    return {
      type: "success",
      txt: getAlertTrans("submit", item),
    };
  },

  quit(item) {
    return {
      type: "success",
      txt: getAlertTrans("quit", item),
    };
  },

  remove(item, removedCount, isUndo = false) {
    return {
      type: "success",
      txt: getAlertTrans("remove", item, removedCount),
      isUndo,
    };
  },

  failRemove(item) {
    return {
      type: "fail",
      txt: getAlertTrans("failRemove", item),
    };
  },

  archive(item, isArchive, archivedCount) {
    return {
      type: "success",
      txt: getAlertTrans(
        isArchive ? "archive" : "restore",
        item,
        archivedCount
      ),
    };
  },

  failArchive(item) {
    return {
      type: "fail",
      txt: getAlertTrans("failArchive", item),
    };
  },

  change(item) {
    return {
      type: "success",
      txt: getAlertTrans("change", item),
    };
  },

  copy(item) {
    return {
      type: "success",
      txt: getAlertTrans("copy", item),
    };
  },

  send(item) {
    return {
      type: "success",
      txt: getAlertTrans("send", item),
    };
  },
};
