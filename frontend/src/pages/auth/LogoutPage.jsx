import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import HeroSection from "../../components/common/HeroSection";
import logoutBg from "/assets/bg-logout.jpg";

const LogoutPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function performLogout() {
      await logout(false);
      navigate("/login");
    }
    performLogout();
  }, [logout, navigate]);

  return (
    <>
      <HeroSection
        bgImage={logoutBg}
        headline="Signing You Out"
        subtext="Thank you for using Synergy Health"
      />
      <div className="text-center text-white mt-10">
        <p>Please wait a moment while we log you out...</p>
      </div>
    </>
  );
};

export default LogoutPage;
