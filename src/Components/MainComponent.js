import React, { useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";
import Webcam from "react-webcam";
import { drawMesh } from "./Utilities";

const MainComponent = () => {
  // useRef Parameters
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // Load Facemesh
  const runFaceMesh = async () => {
    const net = await facemesh.load({
      inputResolution: { width: 650, height: 480 },
      scale: 0.8,
    });
    setInterval(() => {
      detect(net);
    }, 100);
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Video Properties
      const video = webcamRef.current.video;
      const videoHeight = webcamRef.current.video.videoHeight;
      const videoWidth = webcamRef.current.video.videoWidth;

      // Set Video width
      webcamRef.current.video.height = videoHeight;
      webcamRef.current.video.width = videoWidth;

      // Set canvas width
      canvasRef.current.height = videoHeight;
      canvasRef.current.width = videoWidth;

      // Detection
      const face = await net.estimateFaces(video);
      console.log(face);

      // Get Canvas cpntext for frawing
      const ctx = canvasRef.current.getContext('2d');
      drawMesh(face,ctx);
    }
  };

  runFaceMesh();
  return (
    <div className="App">
      <div className="App-header">
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 10,
            width: 650,
            height: 480,
          }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zIndex: 10,
            width: 650,
            height: 480,
          }}
        />
      </div>
    </div>
  );
};

export default MainComponent;
