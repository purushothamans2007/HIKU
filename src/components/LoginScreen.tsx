import React, { useState } from 'react';
import { ArrowRight, Lock, CheckCircle2, Phone, Shield, Sparkles } from 'lucide-react';
import { LiquidShaderBackground } from './LiquidShaderBackground';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ripplePos, setRipplePos] = useState<{ x: number; y: number } | null>(null);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 5) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setOtpStep(true);
    }, 600);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val[val.length - 1];
    const newOtp = [...otpCode];
    newOtp[index] = val;
    setOtpCode(newOtp);

    // Auto-focus next input
    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess();
    }, 800);
  };

  const triggerDemoLogin = () => {
    setPhoneNumber('98401 22890');
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess();
    }, 500);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#121317] p-4 selection:bg-[#4b8eff] selection:text-[#00285c]">
      {/* Interactive Liquid WebGL Shader Background */}
      <LiquidShaderBackground />

      {/* Dim Overlay */}
      <div className="fixed inset-0 bg-[#121317]/50 backdrop-blur-[2px] pointer-events-none" />

      {/* Center Glass Login Card */}
      <main className="relative z-10 w-full max-w-md">
        <div className="frosted-panel rounded-3xl p-8 sm:p-10 flex flex-col items-center border border-white/20 shadow-[0_32px_80px_rgba(0,0,0,0.8)] relative overflow-hidden">
          {/* Subtle Top Glow Accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#4b8eff] to-transparent opacity-80 shadow-[0_0_12px_rgba(75,142,255,0.8)]" />

          {/* Branding 3D Logo */}
          <div className="mb-6 w-36 h-36 sm:w-40 sm:h-40 relative flex items-center justify-center">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6EMEs-PXxmUewqtvJA2brcy_vtk9HzqDyFgxkUpKbQzHRHYImKEsM489xyzZA0MYF2XItWQczAE12DvSUdZR27Ibse1oJFcJLT9h80DykXhUX7O_oS5mhaf_XmE2WCdLSAKDniJBzcFOPJDOGMwcRW_xqbUzyoB4ctWAdyTHDEUnzM32xzqrTNn58kMS2G_UYRJx7-V77_P_U7IAijuh_mzKD8wTaVRukHsXUHuet8SZuO606v5Fr"
              alt="Hiku 3D Glass Street Light Monitoring Logo"
              className="w-full h-full object-contain filter drop-shadow-[0_0_25px_rgba(75,142,255,0.45)] hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Header Text */}
          <div className="text-center mb-6 w-full">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-1">
              {otpStep ? 'Verify Terminal Code' : 'Welcome Back'}
            </h1>
            <p className="text-sm text-[#c1c6d7]">
              {otpStep
                ? `Enter the 4-digit token dispatched to ${phoneNumber}`
                : 'Enter your mobile number to access the grid.'}
            </p>
          </div>

          {!otpStep ? (
            /* Phone Number Input Form */
            <form onSubmit={handlePhoneSubmit} className="w-full flex flex-col gap-4">
              <div className="relative w-full">
                <input
                  id="mobileNumber"
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder=" "
                  pattern="[0-9+ -]*"
                  className="peer frosted-input w-full rounded-2xl text-white font-medium text-base pt-6 pb-2.5 px-4 focus:ring-0 focus:outline-none transition-all placeholder-transparent"
                />
                <label
                  htmlFor="mobileNumber"
                  className="absolute left-4 top-4 text-[#8b90a0] text-sm transition-all duration-200 pointer-events-none peer-focus:-translate-y-2.5 peer-focus:text-xs peer-focus:text-[#4b8eff] peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-[#4b8eff]"
                >
                  Mobile Number
                </label>
                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8b90a0] pointer-events-none" />
              </div>

              {/* Liquid Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="frosted-btn w-full rounded-2xl py-3.5 mt-2 flex items-center justify-center gap-2 text-white font-semibold text-base bg-[#4b8eff] hover:bg-[#6ba3ff] group shadow-[0_4px_20px_rgba(75,142,255,0.4)] border border-white/30 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Transmitting OTP...
                  </span>
                ) : (
                  <>
                    <span>Send OTP</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>

              {/* Quick One-Click Demo Access */}
              <button
                type="button"
                onClick={triggerDemoLogin}
                className="w-full py-2.5 rounded-xl text-xs text-[#adc6ff] hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 flex items-center justify-center gap-1.5 transition-all mt-1 frosted-btn"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#39dcd2]" />
                <span>Instant Demo Access (Chennai Command Grid)</span>
              </button>
            </form>
          ) : (
            /* OTP Code Verification Form */
            <form onSubmit={handleVerifyOtp} className="w-full flex flex-col gap-5">
              <div className="flex justify-center gap-3">
                {otpCode.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-input-${i}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    className="w-13 h-14 text-center font-mono font-bold text-2xl frosted-input rounded-2xl text-white focus:border-[#4b8eff] focus:ring-1 focus:ring-[#4b8eff] focus:outline-none"
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              <div className="flex justify-between items-center text-xs text-[#c1c6d7] px-1">
                <span>Didn't receive code?</span>
                <button
                  type="button"
                  onClick={() => alert('New authentication token dispatched to telemetry line.')}
                  className="text-[#4b8eff] hover:underline font-medium"
                >
                  Resend SMS
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="frosted-btn w-full rounded-2xl py-3.5 mt-1 flex items-center justify-center gap-2 text-white font-semibold text-base bg-[#4b8eff] hover:bg-[#6ba3ff] group shadow-[0_4px_20px_rgba(75,142,255,0.4)] border border-white/30 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating Key...
                  </span>
                ) : (
                  <>
                    <span>Verify & Access Grid</span>
                    <CheckCircle2 className="w-4 h-4 text-[#39dcd2]" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setOtpStep(false)}
                className="text-xs text-[#8b90a0] hover:text-white text-center mt-1"
              >
                ← Change mobile number
              </button>
            </form>
          )}

          {/* Contextual Security Footer */}
          <div className="mt-8 text-center flex items-center justify-center gap-1.5 text-xs text-[#8b90a0]">
            <Shield className="w-3.5 h-3.5 text-[#39dcd2]" />
            <span>Secure access for authorized municipal personnel only.</span>
          </div>
        </div>
      </main>
    </div>
  );
};
