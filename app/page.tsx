"use client";
import React, { useEffect, useRef, useState } from "react";
import CaptureIcon from "./Icons/CaptureIcon";
import CloseIcon from "./Icons/CloseIcon";
import DoneIcon from "./Icons/DoneIcon";
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
} | null;
const CameraApp: React.FC = () => {
  const [captureState, setCaptureState] = useState(false);
  const [resultSend, setResultSend] = useState(false);
  const [resultData, setResultData] = useState<ResultData>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        })
        .catch((error: Error) => {
          console.error("Error accessing the camera:", error);
        });
    }
  }, []);

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
        <video
          ref={videoRef}
          className={`canvas ${captureState ? "hidden" : ""} ${
            resultData == null ? "" : "block"
          }`}
          autoPlay
        ></video>
        <button
          onClick={discardPhoto}
          className={`close-btn btn ${captureState ? "" : "hidden"}`}
        >
          <CloseIcon size={48} fill="#8d0606" />
        </button>
        <button
          onClick={capturePhoto}
          className={`capture-btn btn ${captureState ? "hidden" : ""}`}
        >
          <CaptureIcon size={48} fill="#333" />
        </button>
        <button
          onClick={sendPhoto}
          className={`send-btn btn ${captureState ? "" : "hidden"}`}
        >
          <DoneIcon size={48} fill="#11841d" />
        </button>
        <canvas
          ref={canvasRef}
          className={`canvas ${captureState ? "" : "hidden"}`}
        ></canvas>
        <div className={`result ${resultSend ? "" : "hidden"}`}>
          {resultData &&
          resultData.data &&
          typeof resultData.data === "object" &&
          Object.keys(resultData.data).length > 0 ? (
            <>
              <button onClick={closeResult} className="closeBtn">
                <CloseIcon size={24} fill="#ffffff" />
              </button>
              <h2>Nutritional Information:&emsp;</h2>
              <div className="pill">Protein: {resultData.data.protein}g</div>
              <div className="pill">
                Carbohydrates: {resultData.data.carbohydrates}g
              </div>
              <div className="pill">Fats: {resultData.data.fats}g</div>
              <div className="pill">Sugars: {resultData.data.sugars}g</div>
              <div className="pill">Calories: {resultData.data.calories}</div>
              <h3>Other:</h3>
              <ul>
                <div className="pill">
                  Fiber: {resultData.data.other_nutrients.fiber}g
                </div>
                <div className="pill">
                  Sodium: {resultData.data.other_nutrients.sodium}g
                </div>
                <div className="pill">
                  Cholesterol: {resultData.data.other_nutrients.cholesterol}g
                </div>
              </ul>
              {resultData.suggestion && (
                <div className="suggestion pill flex">
                  {resultData.suggestion}
                </div>
              )}
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default CameraApp;
