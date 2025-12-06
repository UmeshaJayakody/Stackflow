export default function LoadingDots() {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className="w-3 h-3 bg-gray-900 rounded-full animate-bounce [animation-delay:0ms]"></div>
      <div className="w-3 h-3 bg-gray-900 rounded-full animate-bounce [animation-delay:150ms]"></div>
      <div className="w-3 h-3 bg-gray-900 rounded-full animate-bounce [animation-delay:300ms]"></div>
    </div>
  );
}
