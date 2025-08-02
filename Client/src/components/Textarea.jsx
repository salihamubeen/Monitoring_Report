import React from 'react';

const Textarea = ({ label, id, register, error, labelClassName = '', ...rest }) => (
  <div className="mb-4">
    <label htmlFor={id} className={`block text-sm font-medium mb-1 ${labelClassName}`}>
      {label}
    </label>
    <textarea
      id={id}
      className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-black border-gray-300 ${error ? 'border-red-500' : 'border-gray-300'}`}
      rows={4}
      {...register}
      {...rest}
    />
    {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
  </div>
);

export default Textarea; 