export default function LoadingDots({ color = "bg-gray-900" }: { color?: string }) {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className={`w-3 h-3 ${color} rounded-full animate-bounce [animation-delay:0ms]`}></div>
      <div className={`w-3 h-3 ${color} rounded-full animate-bounce [animation-delay:150ms]`}></div>
      <div className={`w-3 h-3 ${color} rounded-full animate-bounce [animation-delay:300ms]`}></div>
    </div>
  );
}
