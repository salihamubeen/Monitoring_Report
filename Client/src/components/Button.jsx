import React from 'react';

const Button = ({ type = 'button', children, className = '', ...rest }) => (
  <button
    type={type}
    className={`px-10 py-2 rounded-sm bg-[#36a9e1] text-white text-sm font-medium hover:bg-[#5bc0ee] focus:outline-none focus:ring-2 focus:ring-[#5bc0ee] transition-colors duration-200 ${className}`}
    {...rest}
  >
    {children}
  </button>
);

export default Button; 