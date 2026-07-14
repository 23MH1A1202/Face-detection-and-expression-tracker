import React from 'react';
import { BookOpen, Code2, Database, Shield } from 'lucide-react';

export function About() {
  return (
    <div className="max-w-4xl mx-auto w-full space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="text-center space-y-2 mb-10">
        <h2 className="text-3xl font-bold tracking-tight text-white">About FaceSense AI</h2>
        <p className="text-gray-400">Understanding the technology and datasets behind the emotion tracker.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-6 md:p-8 shadow-xl">
          <div className="w-12 h-12 bg-blue-500/20 border border-blue-400/30 rounded-xl flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)] mb-6">
            <BookOpen size={24} />
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">How it Works</h3>
          <p className="text-gray-300 leading-relaxed text-sm">
            FaceSense AI uses your device's camera to run real-time facial detection and expression analysis directly in your browser. Every few seconds, the dominant emotion and micro-expressions are automatically logged, providing a continuous emotional timeline in your dashboard. No video data is ever recorded or sent to a server.
          </p>
        </div>

        <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-6 md:p-8 shadow-xl">
          <div className="w-12 h-12 bg-purple-500/20 border border-purple-400/30 rounded-xl flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)] mb-6">
            <Code2 size={24} />
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">Technology Stack</h3>
          <ul className="text-gray-300 space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-purple-400 font-bold">›</span>
              <span><strong>React 19 & TypeScript:</strong> Core application framework.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 font-bold">›</span>
              <span><strong>Deep Learning Network:</strong> Built on TensorFlow.js for in-browser face detection using Kaggle datasets.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 font-bold">›</span>
              <span><strong>Recharts:</strong> Renders the dynamic timeline and distribution analytics.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-400 font-bold">›</span>
              <span><strong>Tailwind CSS:</strong> Styling with a custom Frosted Glass UI aesthetic.</span>
            </li>
          </ul>
        </div>

        <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-6 md:p-8 shadow-xl md:col-span-2">
          <div className="w-12 h-12 bg-green-500/20 border border-green-400/30 rounded-xl flex items-center justify-center text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.2)] mb-6">
            <Database size={24} />
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">Datasets & Models</h3>
          <p className="text-gray-300 leading-relaxed text-sm mb-4">
            The AI models running in this application are lightweight neural networks optimized for web browsers. They were trained on large-scale open-source datasets to recognize human faces and map expressions:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-black/20 rounded-xl p-4 border border-white/5">
              <h4 className="text-white font-medium mb-1">Kaggle Face Detection Dataset</h4>
              <p className="text-xs text-gray-400 mb-3">Used for training the lightweight face detection model, providing accurate bounding box localization.</p>
              <a href="https://www.kaggle.com/datasets/datamunge/sign-language-mnist" target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:text-blue-300 underline underline-offset-2">Visit Kaggle Dataset</a>
            </div>
            <div className="bg-black/20 rounded-xl p-4 border border-white/5">
              <h4 className="text-white font-medium mb-1">FER-2013 Dataset (Kaggle)</h4>
              <p className="text-xs text-gray-400 mb-3">Facial Expression Recognition dataset used for the emotion mapping network (7 discrete emotions).</p>
              <a href="https://www.kaggle.com/c/challenges-in-representation-learning-facial-expression-recognition-challenge/data" target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:text-blue-300 underline underline-offset-2">Visit Kaggle Dataset</a>
            </div>
          </div>
        </div>
        
        <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 p-4 shadow-xl md:col-span-2 flex items-center gap-4">
           <div className="w-10 h-10 shrink-0 bg-yellow-500/20 border border-yellow-400/30 rounded-full flex items-center justify-center text-yellow-400">
              <Shield size={20} />
           </div>
           <p className="text-xs text-gray-400 leading-relaxed">
             <strong className="text-gray-200">Privacy First:</strong> All processing is done client-side in your browser. No image data is transmitted over the network or stored on any external servers. The dashboard data is stored securely in your browser's local storage.
           </p>
        </div>
      </div>
    </div>
  );
}
