import React from "react";
import LoginForm from "../../components/auth/LoginForm";
import HeroSection from "../../components/common/HeroSection";
import loginBg from "/assets/bg-login.jpg";

const LoginPage = () => (
  <>
    <HeroSection 
      bgImage={loginBg} 
      headline="Welcome Back" 
      subtext="Please sign in to your account" 
    />
    <LoginForm />
  </>
);

export default LoginPage;
