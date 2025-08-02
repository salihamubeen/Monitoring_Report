import React from 'react';

const FormInput = ({ label, id, type = 'text', register, error, labelClassName = '', ...rest }) => (
  <div className="mb-4">
    <label htmlFor={id} className={`block text-sm font-medium mb-1 ${labelClassName}`}>
      {label}
    </label>
    <input
      id={id}
      type={type}
      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-black border-gray-300 ${error ? 'border-red-500' : 'border-gray-300'}`}
      {...register}
      {...rest}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
  </div>
);

export default FormInput; 