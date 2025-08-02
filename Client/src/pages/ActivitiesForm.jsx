import React from 'react';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FormInput from '../components/FormInput';
import Textarea from '../components/Textarea';
import Button from '../components/Button';

const LOCATIONS = [
  'Narowal',
  'Baddomalhi',
  'Talwandi Bhindran',
  'Dhamthal',
  'Pasroor',
  'Qila Ahmadabad',
  'Chawinda',
  'Daska',
  'Sambrial',
  'Ugoki',
  'Shakargarh',
  'Kanjroor',
  'Laar Adda',
  'MDA',
  'Bilal Chowk',
  'Mumtazabad',
  'Muzaffargarh',
  'Rohilanwali',
  'Chishtian',
  'Khanewal',
  'Bahawalnagar'
];

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Compress image function
const compressImage = (file, maxWidth = 800, quality = 0.7) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

const CCTVReportForm = () => {
  const [images, setImages] = React.useState([]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Convert images to base64 with compression
  const convertImagesToBase64 = async (files) => {
    const base64Images = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        // Compress image before converting to base64
        const compressedImage = await compressImage(file);
        base64Images.push(compressedImage);
      } catch (error) {
        console.error('Error compressing image:', error);
        // Fallback to original conversion if compression fails
        const base64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
        base64Images.push(base64);
      }
    }
    return base64Images;
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Convert images to base64 with compression
      const base64Images = await convertImagesToBase64(images);
      
      // Prepare the request payload
      const payload = {
        datetime: data.datetime,
        location: data.location,
        findings: data.findings,
        intensity: data.intensity,
        images: base64Images
      };

      // Make API call to create report
      const response = await fetch(`${API_BASE_URL}/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit report');
      }

      const result = await response.json();
      
      toast.success('Report submitted successfully!');
      setImages([]);
      reset();
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error(error.message || 'Failed to submit report.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file sizes (max 5MB per image)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        toast.warning(`Image ${file.name} is too large. Please select a smaller image.`);
        return false;
      }
      return true;
    });
    
    setImages(validFiles);
  };

  const handleReset = () => {
    reset();
    setImages([]);
    toast.info('Form has been reset');
  };

  return (
    <>
      {/* Google Fonts for Poppins */}
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ fontFamily: 'Poppins, sans-serif' }}>
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="mb-8 mt-6">
          <div className="text-2xl font-medium text-center text-black">CCTV MONITORING FORM</div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <FormInput
            label="Date & Time"
            id="datetime"
            type="datetime-local"
            register={register('datetime', { required: 'Date & Time is required' })}
            error={errors.datetime}
            labelClassName="text-gray-700"
          />
          <div className="mb-4">
            <label htmlFor="location" className="block text-sm font-medium mb-1 text-gray-700">Location</label>
            <div className="relative">
              <select
                id="location"
                className={`w-full pr-10 pl-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-black border-gray-300 appearance-none ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
                {...register('location', { required: 'Location is required' })}
              >
                <option value="">Select Location</option>
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-black">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
          </div>
          <Textarea
            label="Findings / Concerns"
            id="findings"
            register={register('findings', { required: 'Findings are required' })}
            error={errors.findings}
            labelClassName="text-gray-700"
          />
          <div className="mb-4 relative">
            <label htmlFor="intensity" className="block text-sm font-medium mb-1 text-gray-700">Activity Intensity</label>
            <select
              id="intensity"
              className={`w-full pr-10 pl-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-black border-gray-300 appearance-none ${errors.intensity ? 'border-red-500' : 'border-gray-300'}`}
              {...register('intensity', { required: 'Activity Intensity is required' })}
            >
              <option value="">Select Intensity</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-black">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
            {errors.intensity && <p className="text-red-500 text-xs mt-1">{errors.intensity.message}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="images" className="block text-sm font-medium mb-1 text-gray-700">
              Images (You can select multiple - Max 5MB each, will be compressed)
            </label>
            <input
              id="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-black border-gray-300"
            />
            {images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {images.map((img, idx) => (
                  <img
                    key={idx}
                    src={URL.createObjectURL(img)}
                    alt={`preview-${idx}`}
                    className="w-20 h-20 object-cover rounded border"
                  />
                ))}
              </div>
            )}
          </div>
          <div className="flex gap-3 mt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
            <Button type="button" className="bg-gray-400 hover:bg-gray-500" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CCTVReportForm; 