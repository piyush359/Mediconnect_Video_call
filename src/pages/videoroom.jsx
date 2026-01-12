import "./video.css";

export default function VideoRoom() {
  return (
    <div className="room">

      {/* Top bar */}
      <div className="top-bar">
        <h3>Mediconnect • Video Consultation</h3>
        <span>Room: #2349</span>
      </div>

      {/* Video area */}
      <div className="video-area">

        {/* Remote user */}
        <video className="remote-video" autoPlay playsInline />

        {/* Your camera */}
        <video className="local-video" autoPlay muted playsInline />

      </div>

      {/* Controls */}
      <div className="controls">
        <button className="btn">🎤</button>
        <button className="btn">📷</button>
        <button className="btn end">⛔ End</button>
      </div>

    </div>
  );
}
