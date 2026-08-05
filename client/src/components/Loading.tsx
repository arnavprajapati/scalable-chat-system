import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center min-h-screen bg-transparent">
      <div className="h-12 w-12 rounded-full border-4 border-gray-200 border-t-gray-900 dark:border-white/10 dark:border-t-white animate-spin" />
    </div>
  );
};

export default Loading;
