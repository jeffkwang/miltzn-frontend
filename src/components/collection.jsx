import { API_URL } from "../api"
const collections = [
    {
      name: 'Core',
      href: "https://miltzn.com/collections/Core/",
      imageSrc: 'https://images.pexels.com/photos/1724228/pexels-photo-1724228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      imageAlt: 'Brown leather key ring with brass metal loops and rivets on wood table.',
      description: 'Don\'t know where to start?',
    },
  ]
  
export default function Collection() {
    return (
        <section
            aria-labelledby="collection-heading"
            className="mx-auto max-w-xl px-4 pt-24 sm:px-6 sm:pt-32 lg:max-w-7xl lg:px-8"
            >
            <h2 id="collection-heading" className="text-2xl font-bold tracking-tight text-gray-900">
            Shop by Collection
            </h2>
            <p className="mt-4 text-base text-gray-500">
            Hand-picked favorites by season, style, and price.
            </p>

            <div className="mt-10 space-y-12 lg:grid lg:grid-cols-3 lg:gap-x-8 lg:space-y-0">
            {collections.map((collection) => (
                <a key={collection.name} href={collection.href} className="group block">
                <div
                    aria-hidden="true"
                    className="aspect-h-2 aspect-w-3 overflow-hidden rounded-lg lg:aspect-h-6 lg:aspect-w-5 group-hover:opacity-75"
                >
                    <img
                    src={collection.imageSrc}
                    alt={collection.imageAlt}
                    className="h-full w-full object-cover object-center"
                    />
                </div>
                <h3 className="mt-4 text-base font-semibold text-gray-900">{collection.name}</h3>
                <p className="mt-2 text-sm text-gray-500">{collection.description}</p>
                </a>
            ))}
            </div>
        </section>
    )
    }