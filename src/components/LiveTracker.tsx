import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { Camera, CheckCircle2 } from 'lucide-react';
import { addLog } from '../store';
import { Emotion } from '../types';

const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';

export function LiveTracker() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<{ emotion: string; confidence: number } | null>(null);
  const [isLogging, setIsLogging] = useState(false);
  
  // Load models
  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        setIsModelLoaded(true);
      } catch (e) {
        console.error("Error loading models:", e);
      }
    };
    loadModels();
  }, []);

  // Start video
  useEffect(() => {
    if (!isModelLoaded) return;
    
    let stream: MediaStream | null = null;
    const startVideo = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    };
    startVideo();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isModelLoaded]);

  const handleVideoPlay = () => {
    setIsPlaying(true);
  };

  useEffect(() => {
    if (!isPlaying || !videoRef.current || !canvasRef.current || !isModelLoaded) return;
    
    const interval = setInterval(async () => {
      if (videoRef.current && canvasRef.current) {
        const detections = await faceapi.detectAllFaces(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        ).withFaceExpressions();

        if (detections && detections.length > 0) {
          const detection = detections[0];
          
          // Draw bounding box
          const displaySize = { 
            width: videoRef.current.videoWidth, 
            height: videoRef.current.videoHeight 
          };
          faceapi.matchDimensions(canvasRef.current, displaySize);
          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          
          canvasRef.current.getContext('2d')?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
          
          // Find dominant emotion
          const expressions = detection.expressions;
          const sorted = Object.entries(expressions).sort((a, b) => b[1] - a[1]);
          const dominant = sorted[0];
          
          setCurrentEmotion({
            emotion: dominant[0],
            confidence: dominant[1]
          });
        } else {
          canvasRef.current.getContext('2d')?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          setCurrentEmotion(null);
        }
      }
    }, 200);

    return () => clearInterval(interval);
  }, [isPlaying, isModelLoaded]);
  
  const handleLogEmotion = async () => {
    if (!currentEmotion || !videoRef.current) return;
    
    setIsLogging(true);
    
    // Do a fresh read to get full expressions
    const detections = await faceapi.detectSingleFace(
      videoRef.current,
      new faceapi.TinyFaceDetectorOptions()
    ).withFaceExpressions();
    
    if (detections) {
      const expressions = detections.expressions;
      const sorted = Object.entries(expressions).sort((a, b) => b[1] - a[1]);
      const dominant = sorted[0];
      
      addLog({
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        emotion: dominant[0] as Emotion,
        confidence: dominant[1],
        expressions: expressions as any
      });
    }
    
    setTimeout(() => setIsLogging(false), 1000);
  };

  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto w-full p-4 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-white">Live Expression Tracker</h2>
        <p className="text-gray-400">Allow camera access to analyze your facial expressions in real-time.</p>
      </div>

      <div className="relative rounded-3xl overflow-hidden bg-black border border-white/10 shadow-2xl w-full max-w-2xl aspect-video flex items-center justify-center">
        {!isModelLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20 bg-[#1a1b26]/80 backdrop-blur-sm">
            <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_8px_cyan]"></div>
            <p className="text-sm font-mono tracking-widest text-cyan-400">LOADING NEURAL NET...</p>
          </div>
        )}
        
        <video 
          ref={videoRef}
          autoPlay 
          muted 
          playsInline
          onPlay={handleVideoPlay}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full z-10"
        />
        
        <div className="absolute top-4 left-4 z-20">
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)]"></span>
                <span className="text-[10px] text-gray-300 font-mono uppercase tracking-widest bg-black/50 px-2 py-1 rounded backdrop-blur">Camera Active</span>
            </div>
        </div>
      </div>

      <div className="w-full max-w-2xl backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-500/20 border border-blue-400/30 rounded-xl flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <Camera size={24} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-mono mb-1">Primary Emotion</p>
              {currentEmotion ? (
                <div className="flex items-baseline space-x-3">
                  <span className="text-2xl font-bold capitalize text-white">
                    {currentEmotion.emotion}
                  </span>
                  <span className="text-sm text-cyan-400 font-mono">
                    {Math.round(currentEmotion.confidence * 100)}%
                  </span>
                </div>
              ) : (
                <p className="text-lg font-medium text-gray-500">Scanning...</p>
              )}
            </div>
          </div>
          
          <button
            onClick={handleLogEmotion}
            disabled={!currentEmotion || isLogging}
            className="flex items-center space-x-2 bg-blue-500/20 hover:bg-blue-500/30 backdrop-blur-md border border-blue-400/40 disabled:bg-white/5 disabled:border-white/10 disabled:text-gray-600 text-blue-400 px-6 py-3 rounded-xl font-medium transition-all shadow-[0_0_10px_rgba(59,130,246,0.1)]"
          >
            {isLogging ? (
              <>
                <CheckCircle2 size={20} className="text-green-400" />
                <span className="text-green-400">Logged</span>
              </>
            ) : (
              <span>Capture Snapshot</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
