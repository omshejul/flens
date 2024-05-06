"use client";
import React, { useEffect, useRef, useState } from "react";
import { FadeLoader } from "react-spinners";
import CaptureIcon from "./Icons/CaptureIcon";
import CloseIcon from "./Icons/CloseIcon";
import DoneIcon from "./Icons/DoneIcon";
import SwitchCameraIcon from "./Icons/SwitchCameraIcon";
import { isIOS, isSafari } from 'react-device-detect';
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
  name: string;
  data: NutrientData;
  suggestion?: string;
  error?: string;
} | null;
const CameraApp: React.FC = () => {
  const [facingMode, setFacingMode] = useState("environment");
  const [isCameraLoading, setIsCameraLoading] = useState(true);
  const [captureState, setCaptureState] = useState(false);
  const [dishName, setDishName] = useState('');
  const [resultSend, setResultSend] = useState(false);
  const [resultData, setResultData] = useState<ResultData>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevCount) => prevCount - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [setCount]);

  useEffect(() => {
    if (isIOS) {
      setIsVisible(true);

    }
    if (videoRef.current) {
      videoRef.current.onloadedmetadata = () => {
        // When the metadata has loaded, set the loading state to false
        setIsCameraLoading(false);
      };
    }
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
    setCount(30)
    if (!canvasRef.current) {
      console.log("not working");
      return;
    }

    const imageDataUrl = canvasRef.current.toDataURL("image/png");

    const postData = {
      dishName: dishName,
      image: imageDataUrl,
    };
    console.log(postData);

    fetch("https://arthk4in.el.r.appspot.com/flens", {
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
      {isVisible && (
        <div className="popup result absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-10 ">
          <div className="content">Not supported in iOS</div>
        </div>
      )}
      <div className={`wrapper`}>
        <div className="videoWrapper">
          <video
            ref={videoRef}
            className={`canvas ${captureState ? "hidden" : ""} ${resultData == null ? "" : "block"
              }`}
            autoPlay
          ></video>
          <canvas
            ref={canvasRef}
            className={`canvas ${captureState ? "" : "hidden"}`}
          ></canvas>
        </div>
        {isCameraLoading && (
          <div className="loading absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-10">
            <FadeLoader color="#ffffff" />
          </div>
        )}
        <button
          onClick={discardPhoto}
          className={`close-btn btn ${captureState ? "flex" : "hidden"}`}
        >
          <div className="label text-red-300">Discard</div>
          <CloseIcon size={36} fill="rgb(252 165 165)" />
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
          <CaptureIcon size={48} fill="#ffffff" />
        </button>
        {/* <button
          onClick={sendPhoto}
          className={`send-btn btn ${captureState ? "flex" : "hidden"}`}
        >
          <div className="label">Upload</div>
          <DoneIcon size={36} fill="#11841d" />
        </button> */}
        <div className={`${captureState ? "flex" : "hidden"} inputContainer  result absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col max-w-md text-white`}>
          <label htmlFor="name" className="py-2">What is this dish called?</label>
          <input
            type="name"
            id="name"
            value={dishName}
            onChange={(e) => setDishName(e.target.value)}
            className=" text-black shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter name of the Dish"
          />
          <div className="popBtnContainer flex w-full justify-around mt-2">
            <button onClick={sendPhoto} className={`popupBtn flex border-custom bg-[#0000003d] rounded-full p-2 px-4 m-2 items-center justify-center bg`}>
              <div className="label mr-2">Skip</div>
              <CloseIcon size={20} fill="#ffffff" />
            </button>
            <button onClick={sendPhoto} className={`popupBtn flex border-custom bg-[#0000003d] rounded-full p-2 px-4 m-2 items-center justify-center bg `}>
              <div className="label mr-2">Send</div>
              <DoneIcon size={20} fill="#ffffff" />
            </button>
          </div>

        </div>

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
                <div className="font-semibold m-2 text-xl">
                  {resultData.name}
                </div>
                <div className="pill tracking-tight">
                  Protein: {resultData.data.protein}
                </div>
                <div className="pill tracking-tight">
                  Carbohydrates: {resultData.data.carbohydrates}
                </div>
                <div className="pill tracking-tight">
                  Fats: {resultData.data.fats}
                </div>
                <div className="pill tracking-tight">
                  Sugars: {resultData.data.sugars}
                </div>
                <div className="pill tracking-tight">
                  Calories: {resultData.data.calories}
                </div>
                <h3>Other:</h3>
                <div className="other-container">
                  <div className="pill tracking-tight">
                    Fiber: {resultData.data.other_nutrients.fiber}
                  </div>
                  <div className="pill tracking-tight">
                    Sodium: {resultData.data.other_nutrients.sodium}
                  </div>
                  <div className="pill tracking-tight">
                    Cholesterol: {resultData.data.other_nutrients.cholesterol}
                  </div>
                </div>
                {resultData.suggestion && (
                  <div className="suggestion pill tracking-tight flex">
                    {resultData.suggestion}
                  </div>
                )}
              </>
            ) : (
              <div className="loading p-10 grid place-items-center ">
                <FadeLoader color="#ffffff" />
                <span className="text-2xl border-custom p-2 px-4 mt-8 rounded-full">{count}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CameraApp;
