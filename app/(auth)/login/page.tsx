"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../../context/AuthContext";
import { cn } from "@/lib/utils";
import LoadingDots from "../../components/LoadingDots";

interface AnimatedGridPatternProps {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  strokeDasharray?: any;
  numSquares?: number;
  className?: string;
  maxOpacity?: number;
  duration?: number;
  repeatDelay?: number;
}

export function AnimatedGridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = 0,
  numSquares = 50,
  className,
  maxOpacity = 0.5,
  duration = 4,
  repeatDelay = 0.5,
  ...props
}: AnimatedGridPatternProps) {
  const id = useId();
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [squares, setSquares] = useState(() => generateSquares(numSquares));

  function getPos() {
    return [
      Math.floor((Math.random() * dimensions.width) / width),
      Math.floor((Math.random() * dimensions.height) / height),
    ];
  }

  // Adjust the generateSquares function to return objects with an id, x, and y
  function generateSquares(count: number) {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      pos: getPos(),
    }));
  }

  // Function to update a single square's position
  const updateSquarePosition = (id: number) => {
    setSquares((currentSquares) =>
      currentSquares.map((sq) =>
        sq.id === id
          ? {
              ...sq,
              pos: getPos(),
            }
          : sq,
      ),
    );
  };

  // Update squares to animate in
  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      setSquares(generateSquares(numSquares));
    }
  }, [dimensions, numSquares]);

  // Resize observer to update container dimensions
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, [containerRef]);

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30",
        className,
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
      <svg x={x} y={y} className="overflow-visible">
        {squares.map(({ pos: [x, y], id }, index) => (
          <motion.rect
            initial={{ opacity: 0 }}
            animate={{ opacity: maxOpacity }}
            transition={{
              duration,
              repeat: 1,
              delay: index * 0.1,
              repeatType: "reverse",
            }}
            onAnimationComplete={() => updateSquarePosition(id)}
            key={`${x}-${y}-${index}`}
            width={width - 1}
            height={height - 1}
            x={x * width + 1}
            y={y * height + 1}
            fill="currentColor"
            strokeWidth="0"
          />
        ))}
      </svg>
    </svg>
  );
}

interface DemoAccount {
  role: string;
  fullName: string;
  email: string;
  password: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  { role: "Admin", fullName: "Admin User", email: "admin@example.com", password: "admin123" },
  { role: "Staff", fullName: "Staff User", email: "staff@example.com", password: "staff123" },
];

function DemoAccountModal({
  onSelect,
  onClose,
}: {
  onSelect: (account: DemoAccount) => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-black/10 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-gray-900 mb-1">Try a demo account</h3>
        <p className="text-sm text-gray-600 mb-5">
          Pick a role to fill in the email and password, then click Sign In.
        </p>
        <div className="space-y-3">
          {DEMO_ACCOUNTS.map((account) => (
            <button
              key={account.role}
              type="button"
              onClick={() => onSelect(account)}
              className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-black/10 transition-colors"
            >
              <p className="font-medium text-gray-900">{account.role}</p>
              <p className="text-sm text-gray-600">
                {account.email} / {account.password}
              </p>
            </button>
          ))}
        </div>
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSelectDemoAccount = (account: DemoAccount) => {
    setEmail(account.email);
    setPassword(account.password);
    setError("");
    setShowDemoModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Use AuthContext login function
        login(data.user);
        router.push("/");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen bg-white overflow-hidden relative">
      {/* Background with subtle pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.03)_0%,rgba(255,255,255,0)_80%)]" />
        <div className="stars-background absolute inset-0" />
      </div>

      {/* CSS for subtle pattern background */}
      <style>{`
        .stars-background {
          background-image: 
            radial-gradient(2px 2px at 20px 30px, rgba(0,0,0,0.05), rgba(0,0,0,0)),
            radial-gradient(2px 2px at 40px 70px, rgba(0,0,0,0.03), rgba(0,0,0,0)),
            radial-gradient(2px 2px at 50px 160px, rgba(0,0,0,0.04), rgba(0,0,0,0)),
            radial-gradient(2px 2px at 90px 40px, rgba(0,0,0,0.03), rgba(0,0,0,0)),
            radial-gradient(2px 2px at 130px 80px, rgba(0,0,0,0.05), rgba(0,0,0,0)),
            radial-gradient(2px 2px at 160px 120px, rgba(0,0,0,0.04), rgba(0,0,0,0));
          background-repeat: repeat;
          background-size: 200px 200px;
          animation: twinkle 5s ease-in-out infinite;
          opacity: 0.3;
        }

        @keyframes twinkle {
          0% { opacity: 0.3; }
          50% { opacity: 0.5; }
          100% { opacity: 0.3; }
        }

        @keyframes shooting {
          0% {
            transform: translateX(0) translateY(0);
            opacity: 0.2;
          }
          100% {
            transform: translateX(-1000px) translateY(1000px);
            opacity: 0;
          }
        }

        .shooting-star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: rgba(0,0,0,0.1);
          border-radius: 50%;
          box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.05);
          animation: shooting 3s linear infinite;
        }

        .shooting-star:nth-child(1) {
          top: 10%;
          right: 10%;
          animation-delay: 0s;
        }

        .shooting-star:nth-child(2) {
          top: 30%;
          right: 50%;
          animation-delay: 2s;
        }

        .shooting-star:nth-child(3) {
          top: 50%;
          right: 20%;
          animation-delay: 4s;
        }
      `}</style>

      {/* Shooting elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
        <div className="shooting-star"></div>
      </div>

      {/* Animated Grid Pattern */}
      <AnimatedGridPattern className="z-0" />

      <div className="relative z-10 h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Side - Welcome Content */}
          <div className="hidden lg:flex flex-col justify-center items-center text-center p-8">
            <div className="relative">
              {/* Glowing Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-black/5 backdrop-blur-sm border border-black/10 text-gray-700 text-sm font-medium mb-8">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black/40 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
                </span>
                Secure Platform
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Welcome Back to
                <span className="block bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  StackFlow
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed">
                Continue managing your inventory with trusted and efficient tools
              </p>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
                <div className="flex items-center p-4 bg-black/5 backdrop-blur-sm rounded-xl border border-black/10">
                  <div className="p-2 bg-black/10 rounded-lg mr-4">
                    <svg className="h-5 w-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-gray-900 font-medium">Secure & Trusted</p>
                    <p className="text-gray-600 text-sm">Enterprise-grade security</p>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-black/5 backdrop-blur-sm rounded-xl border border-black/10">
                  <div className="p-2 bg-black/10 rounded-lg mr-4">
                    <svg className="h-5 w-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-gray-900 font-medium">Quality System</p>
                    <p className="text-gray-600 text-sm">Trusted by professionals</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Sign In Form */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md">
              {/* Glass Card Container */}
              <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-black/10 relative overflow-hidden">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/5 pointer-events-none" />
                
                {/* Logo */}
                <div className="relative z-10 flex items-start justify-between mb-8">
                  <div className="text-center flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h2>
                    <p className="text-gray-600">Welcome back! Please enter your details</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDemoModal(true)}
                    className="shrink-0 px-3 py-1.5 text-sm font-medium text-gray-700 bg-black/5 hover:bg-black/10 border border-black/10 rounded-lg transition-colors"
                  >
                    Test
                  </button>
                </div>

                {showDemoModal && (
                  <DemoAccountModal
                    onSelect={handleSelectDemoAccount}
                    onClose={() => setShowDemoModal(false)}
                  />
                )}

                <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <svg className="absolute left-4 top-4 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full pl-12 pr-4 py-4 bg-white/50 backdrop-blur-sm border rounded-xl text-gray-900 placeholder-gray-500 focus:bg-white/70 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 shadow-sm ${
                          error ? 'border-red-500/50 focus:ring-red-500' : 'border-black/20 hover:border-black/30'
                        }`}
                        placeholder="name@email.com"
                        autoComplete="email"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <svg className="absolute left-4 top-4 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`w-full pl-12 pr-12 py-4 bg-white/50 backdrop-blur-sm border rounded-xl text-gray-900 placeholder-gray-500 focus:bg-white/70 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 shadow-sm ${
                          error ? 'border-red-500/50 focus:ring-red-500' : 'border-black/20 hover:border-black/30'
                        }`}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-4 h-5 w-5 text-gray-500 hover:text-gray-900 transition-colors"
                      >
                        {showPassword ? (
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        )}
                      </button>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-end text-sm">
                      <Link href="/forgot-password" className="text-gray-900 font-medium hover:underline transition-colors">
                        Forgot Password?
                      </Link>
                    </div>
                  </div>

                  {error && (
                    <div className="p-4 bg-red-500/10 backdrop-blur-sm border border-red-500/20 rounded-xl">
                      <p className="text-red-600 text-sm text-center">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full overflow-hidden"
                  >
                    <div className="w-full flex items-center justify-center px-6 py-4 bg-gray-900 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/25 disabled:opacity-50 disabled:cursor-not-allowed group-hover:scale-[1.02]">
                      {loading ? (
                        <>
                          <LoadingDots />
                        </>
                      ) : (
                        <>
                          Sign In
                          <svg className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </>
                      )}
                    </div>
                    <div className="absolute inset-0 rounded-xl bg-gray-900 opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
                  </button>

                  <div className="text-center">
                    <p className="text-gray-600 text-sm">
                      This is not a public website. Only authorized persons can access.
                    </p>
                  </div>

                  <p className="text-xs text-gray-500 text-center leading-relaxed">
                    Contact your administrator for Create New Account access.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
