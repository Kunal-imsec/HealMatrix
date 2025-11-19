import React from "react";
import RegisterForm from "../../components/auth/RegisterForm";
import HeroSection from "../../components/common/HeroSection";
import registerBg from "/assets/bg-register.jpg";

const RegisterPage = () => (
  <>
    <HeroSection 
      bgImage={registerBg} 
      headline="Create Patient Account" 
      subtext="Register to access hospital services" 
    />
    <RegisterForm />
  </>
);

export default RegisterPage;
