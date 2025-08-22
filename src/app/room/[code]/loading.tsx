export default function Loading() {
  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
      <div className="space-y-8 w-full max-w-6xl">
        {/* Header Skeleton */}
        <div className="bg-[#1E1E1E] rounded-xl p-6 animate-pulse">
          <div className="h-8 w-2/3 bg-gray-700 rounded-lg mb-6"></div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="h-4 w-1/2 bg-gray-700 rounded"></div>
              <div className="h-4 w-3/4 bg-gray-700 rounded"></div>
            </div>
            <div className="space-y-4">
              <div className="h-4 w-2/3 bg-gray-700 rounded"></div>
              <div className="h-4 w-1/2 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Panel */}
          <div className="bg-[#1E1E1E] rounded-xl p-6 animate-pulse">
            <div className="h-6 w-1/3 bg-gray-700 rounded mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[#2A2A2A] rounded-lg p-4">
                  <div className="h-4 w-1/2 bg-gray-700 rounded mb-2"></div>
                  <div className="h-3 w-1/3 bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel */}
          <div className="bg-[#1E1E1E] rounded-xl p-6 animate-pulse">
            <div className="h-6 w-1/3 bg-gray-700 rounded mb-6"></div>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-[#2A2A2A] rounded-lg p-4">
                  <div className="h-4 w-3/4 bg-gray-700 rounded mb-3"></div>
                  <div className="h-3 w-1/4 bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
