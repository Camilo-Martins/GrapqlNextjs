import React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = ({ ...props }: Props) => {
  return (
    <>
      <input
        className="block w-full rounded-md border-0 py-2 my-1 text-gray-900 shadow-sm 
        ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset
        focud:ring-indigo-600 sm:text-sm sm:leading-6 px-3
        "
        {...props}
      />
    </>
  );
};

export default Input;
