import { useQuery } from '@tanstack/react-query';

const fetchImageUrls = async () => {
  // Here you would fetch from an actual API
  return [
      "https://images.unsplash.com/photo-1582131503261-fca1d1c0589f?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?q=80&w=1884&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1532372320572-cda25653a26d?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1511401139252-f158d3209c17?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1548029833-0852b283f517?q=80&w=1877&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1509422007420-a57adf7b7fdf?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1603913996638-c01100417b4a?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",      
  ];
};

export default function Hero() {
  const { data: imageUrls, isLoading, error } = useQuery({
    queryKey: ['imageUrls'],
    queryFn: fetchImageUrls
  });
  if (isLoading) return <div></div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  // Function to group every two URLs for rendering in the grid structure
  const groupedUrls = imageUrls.reduce((groups, url, index) => {
      if (index % 2 === 0) groups.push([]);
      groups[groups.length - 1].push(url);
      return groups;
  }, []);

  return (
    <div className="relative overflow-hidden bg-white mb-2">
      <div className="pb-80 pt-16 sm:pb-40 sm:pt-24 lg:pb-48 lg:pt-40">
        <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
          <div className="sm:max-w-lg">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Get your cozy on!
            </h1>
            <p className="mt-4 text-xl text-gray-500">
              Discover a wide variety of tufted goods.
            </p>
          </div>
          <div>
            <div className="mt-10">
              {/* Decorative image grid */}
              <div
                aria-hidden="true"
                className="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-7xl"
              >
                <div className="absolute transform sm:left-1/2 sm:top-0 sm:translate-x-8 lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8">
                <div className="flex items-center space-x-6 lg:space-x-8">
                    {/* First Column: Pair of Images */}
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                        {imageUrls.slice(0, 2).map((url, index) => (
                            <div key={index} className="h-64 w-44 overflow-hidden rounded-lg">
                                <img src={url} alt="" className="h-full w-full object-cover object-center" />
                            </div>
                        ))}
                    </div>
                    {/* Second Column: Trio of Images */}
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                        {imageUrls.slice(2, 5).map((url, index) => (
                            <div key={index} className="h-64 w-44 overflow-hidden rounded-lg">
                                <img src={url} alt="" className="h-full w-full object-cover object-center" />
                            </div>
                        ))}
                    </div>
                    {/* Third Column: Pair of Images */}
                    <div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                        {imageUrls.slice(5, 7).map((url, index) => (
                            <div key={index} className="h-64 w-44 overflow-hidden rounded-lg">
                                <img src={url} alt="" className="h-full w-full object-cover object-center" />
                            </div>
                        ))}
                    </div>
                </div>
              </div>
              </div>

              <a
                href="/products"
                className="inline-block rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-center font-medium text-white hover:bg-indigo-700"
              >
                Shop Collection
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
