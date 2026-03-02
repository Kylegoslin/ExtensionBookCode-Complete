
let recorder;
let data = [];



// -----------------------------------------------
// Listen for a start or stop recording message
// -----------------------------------------------
chrome.runtime.onMessage.addListener(async (message) => {
  if (message.target === "offscreen") {
    switch (message.type) {
      case "start-recording":
        startRecording(message.data);
        break;
      case "stop-recording":
        stopRecording();
        break;
      default:
        throw new Error("Unrecognized message:", message.type);
    }
  }
});


// ---------------------------------------------
//
// Main process to record the current steam
//
// ---------------------------------------------
async function startRecording(streamId) {
  if (recorder?.state === "recording") {
    throw new Error("Called startRecording while recording is in progress.");
  }

  const media = await navigator.mediaDevices.getUserMedia({
    audio: {
      mandatory: {
        chromeMediaSource: "tab",
        chromeMediaSourceId: streamId,
      },
    },
    video: {
      mandatory: {
        chromeMediaSource: "tab",
        chromeMediaSourceId: streamId,
      },
    },
  });

  // Continue to play the captured audio to the user.
  const output = new AudioContext();
  const source = output.createMediaStreamSource(media);
  source.connect(output.destination);

  // Start recording.
  recorder = new MediaRecorder(media, { mimeType: "video/webm" });
  recorder.ondataavailable = (event) => data.push(event.data);



  recorder.onstop = () => {
    const blob = new Blob(data, { type: "video/webm" });
    window.open(URL.createObjectURL(blob), "_blank");

    // send a message to background.js to save the
    // recording we have just made
    chrome.runtime.sendMessage({
      type: "save-video-download",
      target: "background",
      data: URL.createObjectURL(blob),
    });

    // Clear state ready for next recording
    recorder = undefined;
    data = [];
  };
  recorder.start();

  window.location.hash = "recording";
}

// -------------------------------------------------------
// Stop the recording process
// -------------------------------------------------------
async function stopRecording() {
  recorder.stop();

  // Stopping the tracks makes sure the recording icon in the tab is removed.
  recorder.stream.getTracks().forEach((t) => t.stop());

  // Update current state in URL
  window.location.hash = "";
}
