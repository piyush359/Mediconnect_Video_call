import { useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const localVideo = useRef(null);
  const remoteVideo = useRef(null);
  const peer = useRef(null);

  useEffect(() => {
    socket.emit("join-room", "mediconnect-room");

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        localVideo.current.srcObject = stream;

        peer.current = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
        });

        stream.getTracks().forEach(track => {
          peer.current.addTrack(track, stream);
        });

        peer.current.ontrack = event => {
          remoteVideo.current.srcObject = event.streams[0];
        };

        peer.current.onicecandidate = event => {
          if (event.candidate) {
            socket.emit("ice-candidate", {
              roomId: "mediconnect-room",
              candidate: event.candidate
            });
          }
        };
      });

    socket.on("offer", async (offer) => {
      await peer.current.setRemoteDescription(offer);
      const answer = await peer.current.createAnswer();
      await peer.current.setLocalDescription(answer);
      socket.emit("answer", {
        roomId: "mediconnect-room",
        answer
      });
    });

    socket.on("answer", async (answer) => {
      await peer.current.setRemoteDescription(answer);
    });

    socket.on("ice-candidate", candidate => {
      peer.current.addIceCandidate(candidate);
    });
  }, []);

  const startCall = async () => {
    const offer = await peer.current.createOffer();
    await peer.current.setLocalDescription(offer);
    socket.emit("offer", {
      roomId: "mediconnect-room",
      offer
    });
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>MediConnect – Video Call</h2>
      <button onClick={startCall}>Start Video Call</button>
      <br /><br />
      <video ref={localVideo} autoPlay muted width="300" />
      <video ref={remoteVideo} autoPlay width="300" />
    </div>
  );
}

export default App;
