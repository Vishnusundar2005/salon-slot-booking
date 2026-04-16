'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../services/api';
import { Sparkles, Upload, Camera, CheckCircle, ArrowRight, Scissors, Video, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AIStylePage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  // Camera state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const router = useRouter();

  // Cleanup camera on unmount
  const streamRef = useRef(null);
  useEffect(() => {
    streamRef.current = stream;
  }, [stream]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const videoCallbackRef = (node) => {
    videoRef.current = node;
    if (node && stream) {
      node.srcObject = stream;
      node.play().catch(err => console.error('Video play error:', err));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File size must be less than 2MB');
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
      stopCamera();
    }
  };

  const startCamera = async () => {
    try {
      // Try to get front-facing camera first
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      setStream(mediaStream);
      setIsCameraActive(true);
      setImage(null);
      setPreview(null);
      setResult(null);
    } catch (err) {
      if (err.name === 'NotFoundError' || err.name === 'OverconstrainedError') {
        try {
          // Fallback: Just grab any available camera
          const fallbackStream = await navigator.mediaDevices.getUserMedia({ 
            video: true 
          });
          setStream(fallbackStream);
          setIsCameraActive(true);
          setImage(null);
          setPreview(null);
          setResult(null);
        } catch (fallbackErr) {
          toast.error('Could not find any camera device on your system.');
          console.error('Camera fallback error:', fallbackErr);
        }
      } else {
        toast.error('Could not access the camera. Please check permissions.');
        console.error('Camera access error:', err);
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
          if (file.size > 2 * 1024 * 1024) {
            toast.error('Captured image is too large');
            return;
          }
          setImage(file);
          setPreview(URL.createObjectURL(file));
          stopCamera();
        }
      }, 'image/jpeg', 0.9);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('image', image);

    try {
      const { data } = await api.post('/ai/hairstyle', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(data);
      toast.success('Analysis complete!');
    } catch (error) {
      console.error('AI Analysis failed:', error);
      toast.error(error.response?.data?.message || 'AI Analysis failed. Make sure your API key is set.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-2xl mb-4 text-indigo-600">
          <Sparkles className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">
          AI Style Analyzer
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Upload a selfie or take a live photo, and let our AI suggest the perfect hairstyle and beard style based on your unique face shape.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Upload/Camera Section */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Input Selection Tabs */}
            {!preview && !isCameraActive && (
              <div className="flex space-x-4 mb-4">
                <button
                  type="button"
                  onClick={() => document.getElementById('image-upload').click()}
                  className="flex-1 flex flex-col items-center justify-center py-6 border-2 border-dashed border-gray-300 rounded-2xl hover:border-indigo-400 hover:bg-indigo-50 transition-colors cursor-pointer"
                >
                  <Upload className="w-8 h-8 text-indigo-500 mb-2" />
                  <span className="text-sm font-bold text-gray-700">Upload Photo</span>
                </button>
                <button
                  type="button"
                  onClick={startCamera}
                  className="flex-1 flex flex-col items-center justify-center py-6 border-2 border-dashed border-gray-300 rounded-2xl hover:border-indigo-400 hover:bg-indigo-50 transition-colors cursor-pointer"
                >
                  <Video className="w-8 h-8 text-indigo-500 mb-2" />
                  <span className="text-sm font-bold text-gray-700">Take Live Photo</span>
                </button>
              </div>
            )}

            <div className="relative group">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="image-upload"
              />
              
              {/* Media Display Area */}
              {(preview || isCameraActive) && (
                <div className="relative w-full h-80 border-2 border-indigo-400 bg-black rounded-3xl overflow-hidden shadow-inner">
                  
                  {isCameraActive ? (
                    <>
                      <video 
                        ref={videoCallbackRef} 
                        autoPlay 
                        playsInline 
                        muted
                        className="w-full h-full object-cover transform scale-x-[-1]" 
                      />
                      <canvas ref={canvasRef} className="hidden" />
                      
                      {/* Camera Controls */}
                      <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-4 z-20">
                        <button
                          type="button"
                          onClick={capturePhoto}
                          className="px-8 py-3 bg-indigo-600 border border-indigo-400 text-white rounded-full font-extrabold shadow-2xl hover:bg-indigo-700 hover:scale-105 transition-all"
                        >
                          Capture Photo
                        </button>
                        <button
                          type="button"
                          onClick={stopCamera}
                          className="px-6 py-3 bg-gray-800/80 backdrop-blur-sm text-white rounded-full font-bold shadow-lg hover:bg-gray-900 transition-all"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : preview ? (
                    <>
                      <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      {!loading && !result && (
                        <button
                          type="button"
                          onClick={() => { setImage(null); setPreview(null); }}
                          className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-2 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-md cursor-pointer z-10"
                        >
                          <XCircle className="h-6 w-6" />
                        </button>
                      )}
                    </>
                  ) : null}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!image || loading}
              className={`w-full flex items-center justify-center px-6 py-4 rounded-2xl text-lg font-bold text-white transition-all transform active:scale-95 ${
                loading || !image
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 cursor-pointer'
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                  Analyzing your features...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Analyze My Style
                </>
              )}
            </button>
            <p className="text-center text-xs text-gray-400 italic">
              * Privacy: Images are processed securely and not stored permanently.
            </p>
          </form>
        </div>

        {/* Results Section */}
        <div className="lg:sticky lg:top-8">
          {result ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {/* Face Shape Info */}
              <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-3xl text-white shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-white/20 backdrop-blur-md rounded-lg">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-bold uppercase tracking-wider opacity-80">Analysis Result</span>
                </div>
                <h2 className="text-3xl font-extrabold mb-2">
                  Face Shape: <span className="capitalize">{result.faceShape}</span>
                </h2>
                <p className="text-indigo-100 text-sm leading-relaxed">
                  {result.explanation}
                </p>
              </div>

              {/* Suggestions Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="text-sm font-extrabold text-gray-500 uppercase tracking-wider mb-4">Hairstyles</h3>
                  <ul className="space-y-2">
                    {result.hairstyles.map((style, idx) => (
                      <li key={idx} className="flex items-center text-gray-800 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2" />
                        {style}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="text-sm font-extrabold text-gray-500 uppercase tracking-wider mb-4">Beard Styles</h3>
                  <ul className="space-y-2">
                    {result.beardStyles.map((style, idx) => (
                      <li key={idx} className="flex items-center text-gray-800 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-2" />
                        {style}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommended Services from DB */}
              {result.recommendedServices && result.recommendedServices.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Scissors className="h-5 w-5 text-indigo-600" />
                    Matching Services
                  </h3>
                  <div className="space-y-3">
                    {result.recommendedServices.map((service) => (
                      <div
                        key={service._id}
                        className="flex items-center justify-between p-4 bg-indigo-50 rounded-2xl border border-indigo-100 group hover:border-indigo-300 transition-all cursor-pointer"
                        onClick={() => router.push('/slotify/book-slot/')}
                      >
                        <div>
                          <p className="font-bold text-indigo-950 uppercase text-sm tracking-tight">{service.name}</p>
                          <p className="text-xs text-indigo-700 font-medium italic">₹{service.price} • {service.duration} mins</p>
                        </div>
                        <div className="p-2 bg-indigo-600 text-white rounded-xl transform group-hover:translate-x-1 transition-transform">
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => router.push('/slotify/book-slot/')}
                      className="w-full py-3 text-sm font-bold text-indigo-600 hover:text-indigo-700 text-center"
                    >
                      View all services
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200 opacity-60">
              <Sparkles className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">Your results will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Warning Disclaimer */}
      <div className="mt-16 p-6 border border-amber-100 bg-amber-50 rounded-2xl flex items-start gap-4">
        <div className="p-2 bg-amber-200 rounded-lg text-amber-800">
          <ArrowRight className="h-5 w-5 rotate-45" />
        </div>
        <div>
          <p className="text-sm font-bold text-amber-900 mb-1">AI Disclaimer</p>
          <p className="text-xs text-amber-700 leading-relaxed">
            AI suggestions are for reference only and based on visual analysis. Hairstyles can look different based on hair texture and personal preference. Consult with our expert barbers for the best final decision. You may need to grant camera permissions to use the live photo feature.
          </p>
        </div>
      </div>
    </div>
  );
}
