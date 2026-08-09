'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useToast } from '../../context/ToastContext';
import { cn } from '@/lib/utils';
import LoadingDots from '../../components/LoadingDots';

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

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Password reset email sent successfully!');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(data.error || 'Failed to send reset email');
        toast.error(data.error || 'Failed to send reset email');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again.');
      toast.error('An error occurred. Please try again.');
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
        <div className="w-full max-w-md">
          {/* Glass Card Container */}
          <div className="bg-white/40 backdrop-blur-xl rounded-3xl p-8 shadow-3xl border border-black/10 relative overflow-hidden">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/5 pointer-events-none" />
            
            {/* Logo */}
            <div className="relative z-10 text-center mb-8">
              <Image
                src="/StackFlow.svg"
                alt="StackFlow Logo"
                width={120}
                height={40}
                className="mx-auto mb-4"
              />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password</h2>
              <p className="text-gray-600">Enter your email to reset your password</p>
            </div>

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
                    className="w-full pl-12 pr-4 py-4 bg-white/50 backdrop-blur-sm border rounded-xl text-gray-900 placeholder-gray-500 focus:bg-white/70 focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 shadow-sm border-black/20 hover:border-black/30"
                    placeholder="name@email.com"
                    required
                  />
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
                <div className="w-full flex items-center justify-center px-6 py-4 bg-gray-900 text-white rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-gray-900/30 disabled:opacity-50 disabled:cursor-not-allowed group-hover:scale-[1.02]">
                  {loading ? (
                    <>
                      <LoadingDots />
                    </>
                  ) : (
                    <>
                      Send Reset Link
                      <svg className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </div>
                <div className="absolute inset-0 rounded-xl bg-gray-900 opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
              </button>

              <div className="text-center">
                <Link href="/login" className="text-gray-900 font-medium hover:underline transition-colors">
                  Back to Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
