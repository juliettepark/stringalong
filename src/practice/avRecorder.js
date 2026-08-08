/**
 * Front-camera + mic recording via MediaRecorder.
 */

// MIME type = the file/container format the browser will write
// Codecs = the actual encoding algorithms used to compress the video and audio
// Choose one that is supported by the user's browser
function pickMimeType() {
  const candidates = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
  ];
  return candidates.find((type) => window.MediaRecorder?.isTypeSupported?.(type)) || "";
}

let stream = null;
let recorder = null;
let chunks = [];

export function isAvActive() {
  return Boolean(recorder && recorder.state !== "inactive");
}

export function isAvPaused() {
  return recorder?.state === "paused";
}

export async function startAvRecording() {
  if (isAvActive()) return stream;

  // wait for stream to be available
  stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: { facingMode: "user" },
  });

  chunks = [];
  const mimeType = pickMimeType();
  // initialize MediaRecorder with stream
  recorder = mimeType
    ? new MediaRecorder(stream, { mimeType })
    : new MediaRecorder(stream);

  recorder.ondataavailable = (event) => {
    if (event.data?.size) chunks.push(event.data);
  };

  // Timeslicing allows us to emit a data chunk every second so it doesn't
  // write up one huge blob at the end (will buffer until stop otherwise)
  recorder.start(1000); // timeslice so pause still retains data
  return stream;
}

export function pauseAvRecording() {
  if (recorder?.state === "recording") recorder.pause();
}

export function resumeAvRecording() {
  if (recorder?.state === "paused") recorder.resume();
}

// We have multiple tracks (video and audio) so we need to stop them all
function stopTracks() {
  stream?.getTracks?.().forEach((track) => track.stop());
  stream = null;
}

function resetRecorder() {
  recorder = null;
  chunks = [];
}

/** Stop without downloading (e.g. discard). */
export function discardAvRecording() {
  try {
    if (recorder && recorder.state !== "inactive") recorder.stop();
  } catch {
    // ignore
  }
  stopTracks();
  resetRecorder();
}

/** Stop recorder, download webm, release camera/mic. */
export function stopAvRecordingAndDownload(filename) {

  // resolve(boolean) means anyone who called await on this gets their value
  // resolve(true) means Promise successfully downloaded file
  // resolve(false) means not downloaded or nothing to stop
  return new Promise((resolve) => {
    if (!recorder || recorder.state === "inactive") {
      stopTracks();
      resetRecorder();
      resolve(false);
      return;
    }

    const activeRecorder = recorder;
    const mimeType = activeRecorder.mimeType || "video/webm";

    activeRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      stopTracks();
      resetRecorder();

      if (blob.size > 0) {
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = filename.endsWith(".webm") ? filename : `${filename}.webm`;
        anchor.click();
        URL.revokeObjectURL(url);
        resolve(true);
      } else {
        resolve(false);
      }
    };

    try {
      activeRecorder.stop();
    } catch {
      stopTracks();
      resetRecorder();
      resolve(false);
    }
  });
}
