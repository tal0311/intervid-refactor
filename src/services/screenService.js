export const screenService = {
  getScreenStream,
  getScreenRecorder,
  disposeScreenStream,
};

let gScreenStream = null;
let gScreenRecorder = null;

async function getScreenStream() {
  if (gScreenStream && gScreenStream.active) return gScreenStream;
  const displayMediaOptions = {
    video: {
      cursor: "always",
      mandatory: {
        maxWidth: 1280,
        maxHeight: 1024,
      },
    },
    audio: false,
  };

  gScreenStream = await navigator.mediaDevices.getDisplayMedia(
    displayMediaOptions
  );
  return gScreenStream;
}

async function getScreenRecorder() {
  if (gScreenRecorder && gScreenRecorder.state !== "inactive")
    return gScreenRecorder;
  gScreenRecorder = new MediaRecorder(gScreenStream);
  return gScreenRecorder;
}

function disposeScreenStream() {
  const tracks = gScreenStream.getTracks();
  tracks.forEach((track) => track.stop());
  gScreenStream = null;
  gScreenRecorder = null;
  return gScreenStream;
}
