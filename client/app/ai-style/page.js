'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../services/api';
import { Sparkles, Upload, Camera, CheckCircle, ArrowRight, Scissors } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AIStylePage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const router = useRouter();

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
          Upload a selfie and let our AI suggest the perfect hairstyle and beard style based on your unique face shape.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Upload Section */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className={`flex flex-col items-center justify-center w-full h-80 border-2 border-dashed rounded-3xl cursor-pointer transition-all ${
                  preview 
                    ? 'border-indigo-400 bg-indigo-50' 
                    : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'
                }`}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-[1.4rem]"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="p-4 bg-white rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                      <Camera className="w-8 h-8 text-indigo-500" />
                    </div>
                    <p className="mb-2 text-sm text-gray-700 font-bold">Click to upload selfie</p>
                    <p className="text-xs text-gray-500 italic">PNG, JPG or JPEG (MAX. 2MB)</p>
                  </div>
                )}
              </label>
              {preview && !loading && !result && (
                <button
                  type="button"
                  onClick={() => { setImage(null); setPreview(null); }}
                  className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-2 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-md"
                >
                  <ArrowRight className="h-5 w-5 rotate-45" />
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={!image || loading}
              className={`w-full flex items-center justify-center px-6 py-4 rounded-2xl text-lg font-bold text-white transition-all transform active:scale-95 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200'
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
            AI suggestions are for reference only and based on visual analysis. Hairstyles can look different based on hair texture and personal preference. Consult with our expert barbers for the best final decision.
          </p>
        </div>
      </div>
    </div>
  );
}
