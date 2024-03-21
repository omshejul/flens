"use client";
import React, { useEffect, useRef, useState } from "react";
import { FadeLoader } from "react-spinners";
import CaptureIcon from "./Icons/CaptureIcon";
import CloseIcon from "./Icons/CloseIcon";
import DoneIcon from "./Icons/DoneIcon";
import SwitchCameraIcon from "./Icons/SwitchCameraIcon";
import "./page.css";
type NutrientData = {
  protein: string;
  carbohydrates: string;
  fats: string;
  sugars: string;
  calories: string;
  other_nutrients: {
    fiber: string;
    sodium: string;
    cholesterol: string;
  };
};

type ResultData = {
  data: NutrientData;
  suggestion?: string;
  error?: string;
} | null;
const CameraApp: React.FC = () => {
  const [facingMode, setFacingMode] = useState("environment");
  const [captureState, setCaptureState] = useState(false);
  const [resultSend, setResultSend] = useState(false);
  const [resultData, setResultData] = useState<ResultData>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Function to stop all tracks on the stream
    const stopMediaTracks = (stream: MediaStream) => {
      stream.getTracks().forEach((track: MediaStreamTrack) => {
        track.stop();
      });
    };

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: facingMode } })
        .then((stream: MediaStream) => {
          // If there's a video stream already playing, stop all its tracks
          if (videoRef.current && videoRef.current.srcObject) {
            stopMediaTracks(videoRef.current.srcObject as MediaStream);
          }

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch((error: Error) => {
          console.error("Error accessing the camera:", error);
        });
    }

    // Return a cleanup function that stops all tracks when the component unmounts
    // or before running the effect again
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        stopMediaTracks(videoRef.current.srcObject as MediaStream);
      }
    };
  }, [facingMode]); // Include facingMode in the dependency array

  const capturePhoto = (): void => {
    console.log("captured photo");

    window.navigator.vibrate(20);
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas && canvas.getContext) {
      const context = canvas.getContext("2d");
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        setCaptureState(true);
      }
    }
  };
  const discardPhoto = (): void => {
    setCaptureState(false);
    setResultData(null);
  };
  const changeFacingMode = (): void => {
    console.log("facingMode:" + facingMode);

    if (facingMode == "environment") {
      setFacingMode("user");
    }
    if (facingMode == "user") {
      setFacingMode("environment");
    }
  };
  const closeResult = (): void => {
    setCaptureState(false);
    setResultData(null);
    setResultSend(false);
  };
  const sendPhoto = (): void => {
    console.log("trying to send");
    setCaptureState(false);
    setResultSend(true);
    if (!canvasRef.current) {
      console.log("not working");
      return;
    }

    const imageDataUrl = canvasRef.current.toDataURL("image/png");

    const postData = {
      image: imageDataUrl,
    };
    console.log(postData);

    fetch("https://arthkin.el.r.appspot.com/flens", {
    // fetch("http://localhost:5001/flens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        setResultData(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <>
      <div className={`wrapper`}>
        <div className="videoWrapper">
          <video
            ref={videoRef}
            className={`canvas ${captureState ? "hidden" : ""} ${
              resultData == null ? "" : "block"
            }`}
            autoPlay
          ></video>
                  <canvas
            ref={canvasRef}
            className={`canvas ${captureState ? "" : "hidden"}`}
          ></canvas>
        </div>
        <button
          onClick={discardPhoto}
          className={`close-btn btn ${captureState ? "flex" : "hidden"}`}
        >
          <div className="label">Discard</div>
          <CloseIcon size={36} fill="#8d0606" />
        </button>
        <button
          onClick={changeFacingMode}
          className={`facing-mode-btn btn ${captureState ? "hidden" : "flex"}`}
        >
          <SwitchCameraIcon size={48} fill="#ffffff" />
        </button>
        <button
          onClick={capturePhoto}
          className={`capture-btn btn ${captureState ? "hidden" : "flex"}`}
        >
          <CaptureIcon size={48} fill="#333" />
        </button>
        <button
          onClick={sendPhoto}
          className={`send-btn btn ${captureState ? "flex" : "hidden"}`}
        >
          <div className="label">Upload</div>
          <DoneIcon size={36} fill="#11841d" />
        </button>

        <div className={`resultContainer ${resultSend ? "grid" : "hidden"}`}>
          <div className={`result ${resultSend ? "" : "hidden"}`}>
            {resultData && resultData.error ? (
              <div className="error-message text-center">
                {resultData.error}
              </div>
            ) : resultData && resultData.data ? (
              <>
                <button onClick={closeResult} className="closeBtn">
                  <CloseIcon size={24} fill="#ff756d" />
                </button>
                <h2>Nutritional Information:&emsp;</h2>
                <div className="pill">Protein: {resultData.data.protein}</div>
                <div className="pill">
                  Carbohydrates: {resultData.data.carbohydrates}
                </div>
                <div className="pill">Fats: {resultData.data.fats}</div>
                <div className="pill">Sugars: {resultData.data.sugars}</div>
                <div className="pill">
                  Calories: {resultData.data.calories} kcal
                </div>
                <h3>Other:</h3>
                <div className="other-container">
                  <div className="pill">
                    Fiber: {resultData.data.other_nutrients.fiber}
                  </div>
                  <div className="pill">
                    Sodium: {resultData.data.other_nutrients.sodium}
                  </div>
                  <div className="pill">
                    Cholesterol: {resultData.data.other_nutrients.cholesterol}
                  </div>
                </div>
                {resultData.suggestion && (
                  <div className="suggestion pill flex">
                    {resultData.suggestion}
                  </div>
                )}
              </>
            ) : (
              <p className="loading p-10 ">
                <FadeLoader color="#ffffff" />
              </p>
            )}
          </div>{" "}
        </div>
      </div>
    </>
  );
};

export default CameraApp;
