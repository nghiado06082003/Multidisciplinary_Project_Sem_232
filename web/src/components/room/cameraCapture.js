import React, { useRef, useEffect, useState } from 'react';
import { useAutoMode } from './autoModeContext';
import { useParams } from 'react-router-dom';


const CameraCapture = () => {
    const {toggleAutoLed} = useAutoMode();
    const {garden_id, room_id} = useParams();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [imageData, setImageData] = useState(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [intervalId, setIntervalId] = useState(null);

    const startCamera = async () => {
        try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        const id = setInterval(() => {
            if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            context.drawImage(videoRef.current, 0, 0, 640, 480);
            const imageData = canvasRef.current.toDataURL('image/png');
            setImageData(imageData);
            detectPerson(imageData);
            }
        }, 5000);
        setIntervalId(id);
        } catch (err) {
        console.error("An error occurred: ", err);
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
        }
        if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
        }
    };

    const detectPerson = async (imageData) => {
        const apiKey = 'API-KEY'; 
        const response = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
        {
            method: 'POST',
            body: JSON.stringify({
            requests: [
                {
                image: {
                    content: imageData.split(',')[1] 
                },
                features: [
                    {
                    type: 'OBJECT_LOCALIZATION'
                    }
                ]
                }
            ]
            })
        }
        );

        const result = await response.json();
        const objects = result.responses[0]?.localizedObjectAnnotations || [];
        const personDetected = objects.some(obj => obj.name === 'Person');
        console.log('Person detected:', personDetected);
        toggleAutoLed(room_id, garden_id, personDetected);
        
    };

    const toggleCamera = () => {
        if (isCameraOn) {
        stopCamera();
        } else {
        startCamera();
        }
        setIsCameraOn(prevState => !prevState);
    };

    return (
        <div>
        <h1>Camera</h1>
        <video ref={videoRef} width="640" height="480" autoPlay></video>
        <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }}></canvas>
        <button onClick={toggleCamera}>
            {isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
        </button>
        </div>
    );
    };

export default CameraCapture;



