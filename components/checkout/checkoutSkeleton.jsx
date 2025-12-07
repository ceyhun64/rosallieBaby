export default function CheckoutSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="mb-8 text-center">
          <div className="h-10 w-64 mx-auto mb-2 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-96 mx-auto bg-gray-200 rounded animate-pulse" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Stepper Skeleton */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-1 flex-1 mx-4 bg-gray-200 rounded animate-pulse" />
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-1 flex-1 mx-4 bg-gray-200 rounded animate-pulse" />
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>

            {/* Form Skeleton */}
            <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
              <div className="h-12 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-12 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-24 w-full bg-gray-200 rounded animate-pulse" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-12 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-12 w-full bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Logo Skeleton */}
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
              </div>

              {/* Summary Skeleton */}
              <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="flex justify-between">
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
