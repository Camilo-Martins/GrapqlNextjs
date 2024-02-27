import React from "react";

interface Props {
  message: string;
  isError: boolean;
}

const Error = (props: Props) => {
  return (
    <h1
      className={`text-center text-white font-semibold
            uppercase py-2 my-2 rounded-sm ${
              props.isError ? "bg-red-600" : "bg-blue-600"
            }`}
    >
      {props.message}
    </h1>
  );
};

export default Error;
