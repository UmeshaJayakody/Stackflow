import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="stars"></div>
        <div className="twinkling"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          {/* 404 Text */}
          <h1 className="text-9xl font-black text-white mb-4 animate-pulse">404</h1>
          
          {/* Message */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Page Not Found</h2>
            <p className="text-gray-300 text-lg">
              Oops! The page you're looking for doesn't exist.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-3 bg-gradient-to-r from-gray-100 to-white text-gray-900 rounded-xl hover:from-white hover:to-gray-100 font-bold shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Go Home
            </Link>
            <Link
              href="/login"
              className="px-8 py-3 bg-gradient-to-r from-gray-700 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-500 font-bold shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Login
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .stars, .twinkling {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 100%;
          height: 100%;
          display: block;
        }

        .stars {
          background: #000 url(/stars.png) repeat top center;
          z-index: 0;
        }

        .twinkling {
          background: transparent url(/twinkling.png) repeat top center;
          z-index: 1;
          animation: move-twink-back 200s linear infinite;
        }

        @keyframes move-twink-back {
          from {
            background-position: 0 0;
          }
          to {
            background-position: -10000px 5000px;
          }
        }
      `}</style>
    </div>
  );
}
