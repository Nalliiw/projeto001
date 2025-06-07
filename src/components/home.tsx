import React from "react";
import LoginForm from "./auth/LoginForm";

const Home = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
      <div className="w-full max-w-md px-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Clinic Management
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Sign in to your account
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default Home;
