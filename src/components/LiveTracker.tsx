import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { Camera, CameraOff } from 'lucide-react';
import { addLog } from '../store';
import { Emotion } from '../types';

const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';

export function LiveTracker() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [currentEmotion, setCurrentEmotion] = useState<{ emotion: string; confidence: number } | null>(null);
  const [allEmotions, setAllEmotions] = useState<Record<string, number>>({});
  
  const lastLogTime = useRef<number>(0);
  
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
        setModelError(e instanceof Error ? e.message : String(e));
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
        setIsCameraOn(false);
      }
    };

    const stopVideo = () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };

    if (isCameraOn) {
      startVideo();
    } else {
      stopVideo();
    }

    return () => {
      stopVideo();
    };
  }, [isModelLoaded, isCameraOn]);

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
          setAllEmotions(expressions as Record<string, number>);

          // Auto-log every 3 seconds
          const now = Date.now();
          if (now - lastLogTime.current > 3000) {
            addLog({
              id: crypto.randomUUID(),
              timestamp: now,
              emotion: dominant[0] as Emotion,
              confidence: dominant[1],
              expressions: expressions as any
            });
            lastLogTime.current = now;
          }
        } else {
          canvasRef.current.getContext('2d')?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          setCurrentEmotion(null);
          setAllEmotions({});
        }
      }
    }, 200);

    return () => clearInterval(interval);
  }, [isPlaying, isModelLoaded]);
  
  return (
    <div className="flex flex-col items-center max-w-4xl mx-auto w-full p-4 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-white">Live Expression Tracker</h2>
        <p className="text-gray-400">Allow camera access to analyze your facial expressions in real-time.</p>
      </div>

      <div className="relative rounded-3xl overflow-hidden bg-black border border-white/10 shadow-2xl w-full max-w-2xl aspect-video flex items-center justify-center">
        {!isModelLoaded && !modelError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20 bg-[#1a1b26]/80 backdrop-blur-sm">
            <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_8px_cyan]"></div>
            <p className="text-sm font-mono tracking-widest text-cyan-400">LOADING NEURAL NET...</p>
          </div>
        )}
        
        {modelError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20 bg-[#1a1b26]/80 backdrop-blur-sm px-6 text-center">
            <div className="text-red-400 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            </div>
            <p className="text-sm font-medium text-red-400 mb-1">Failed to load models</p>
            <p className="text-xs text-gray-400 font-mono break-all">{modelError}</p>
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
            {isCameraOn ? (
              <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.6)]"></span>
                  <span className="text-[10px] text-gray-300 font-mono uppercase tracking-widest bg-black/50 px-2 py-1 rounded backdrop-blur">Camera Active</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 opacity-50">
                  <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
                  <span className="text-[10px] text-gray-300 font-mono uppercase tracking-widest bg-black/50 px-2 py-1 rounded backdrop-blur">Camera Offline</span>
              </div>
            )}
        </div>
      </div>

      <div className="w-full max-w-2xl backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-4 md:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="w-12 h-12 shrink-0 bg-blue-500/20 border border-blue-400/30 rounded-xl flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <Camera size={24} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-mono">Primary Emotion</p>
                {isCameraOn && currentEmotion && (
                  <span className="text-[9px] uppercase tracking-widest text-blue-400 font-mono bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20 animate-pulse">Auto-capturing</span>
                )}
              </div>
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
            onClick={() => setIsCameraOn(!isCameraOn)}
            className={`w-full md:w-auto shrink-0 flex items-center justify-center space-x-2 backdrop-blur-md px-6 py-3 rounded-xl font-medium transition-all ${
              isCameraOn 
                ? 'bg-red-500/20 hover:bg-red-500/30 border border-red-400/40 text-red-400 shadow-[0_0_10px_rgba(248,113,113,0.1)]' 
                : 'bg-green-500/20 hover:bg-green-500/30 border border-green-400/40 text-green-400 shadow-[0_0_10px_rgba(74,222,128,0.1)]'
            }`}
          >
            {isCameraOn ? (
              <>
                <CameraOff size={20} />
                <span>Turn Camera Off</span>
              </>
            ) : (
              <>
                <Camera size={20} />
                <span>Turn Camera On</span>
              </>
            )}
          </button>
        </div>

        {Object.keys(allEmotions).length > 0 && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-mono mb-4">Micro-Expressions</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(allEmotions)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 4) // Show top 4
                .map(([emotion, value]) => (
                  <div key={emotion} className="space-y-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="capitalize text-gray-300">{emotion}</span>
                      <span className="text-gray-400 font-mono">{Math.round(value * 100)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-400 transition-all duration-200" 
                        style={{ width: `${value * 100}%` }}
                      ></div>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
