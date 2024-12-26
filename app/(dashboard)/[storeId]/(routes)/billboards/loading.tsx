import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-center">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32 mb-4"></div>
        <p className="text-xl text-gray-700">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;
