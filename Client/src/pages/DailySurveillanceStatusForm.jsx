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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DailySurveillanceStatusForm = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/daily-surveillance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit form');
      }

      toast.success('Daily Status submitted successfully!');
      reset();
    } catch (error) {
      toast.error(error.message || 'Failed to submit form.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    reset();
    toast.info('Form has been reset');
  };

  return (
    <>
      {/* Google Fonts for Poppins */}
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ fontFamily: 'Poppins, sans-serif' }}>
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="mb-8 mt-6">
          <div className="text-2xl font-medium text-center text-black">DAILY SURVEILLANCE STATUS FORM</div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 w-full">
          <FormInput
            label="Date"
            id="date"
            type="date"
            register={register('date', { required: 'Date is required' })}
            error={errors.date}
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
          <FormInput
            label="Opening Time"
            id="openingTime"
            type="time"
            register={register('openingTime', { required: 'Opening time is required' })}
            error={errors.openingTime}
            labelClassName="text-gray-700"
          />
          <FormInput
            label="Closing Time"
            id="closingTime"
            type="time"
            register={register('closingTime', { required: 'Closing time is required' })}
            error={errors.closingTime}
            labelClassName="text-gray-700"
          />
          <FormInput
            label="Status"
            id="status"
            type="text"
            register={register('status', { required: 'Status is required' })}
            error={errors.status}
            labelClassName="text-gray-700"
          />
          <FormInput
            label="Total Cameras"
            id="totalCameras"
            type="number"
            register={register('totalCameras', { required: 'Total cameras is required', min: 0 })}
            error={errors.totalCameras}
            labelClassName="text-gray-700"
          />
          <FormInput
            label="Working Cameras"
            id="workingCameras"
            type="number"
            register={register('workingCameras', { required: 'Working cameras is required', min: 0 })}
            error={errors.workingCameras}
            labelClassName="text-gray-700"
          />
          <FormInput
            label="Non Working Cameras"
            id="nonWorkingCameras"
            type="number"
            register={register('nonWorkingCameras', { required: 'Non working cameras is required', min: 0 })}
            error={errors.nonWorkingCameras}
            labelClassName="text-gray-700"
          />
          <FormInput
            label="Total Day's Recorded"
            id="totalDaysRecorded"
            type="number"
            register={register('totalDaysRecorded', { required: 'Total day\'s recorded is required', min: 0 })}
            error={errors.totalDaysRecorded}
            labelClassName="text-gray-700"
          />
          <Textarea
            label="Remarks"
            id="remarks"
            register={register('remarks')}
            error={errors.remarks}
            labelClassName="text-gray-700"
          />
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

export default DailySurveillanceStatusForm; 