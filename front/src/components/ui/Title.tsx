import React from "react";

interface Props extends React.HtmlHTMLAttributes<HTMLHeadingElement>{};

const Title = ({children, ...props}: Props) => {
  return (
    <>
      <h2 className=" text-2xl text-gray-800 font-light"
      {...props}>
        {children}
      </h2>
    </>
  );
};

export default Title;
