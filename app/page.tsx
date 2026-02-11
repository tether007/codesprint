"use client"

import { MovingBorder } from "@/components/MovingBorder"

export default function Page() {
  return (
    
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        <div className="relative rounded-2xl bg-black/50 backdrop-blur-sm p-8 border border-zinc-800">
          <MovingBorder
            className="bg-gradient-to-r from-gray-300 via-white to-gray-300"
            size={80}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <div className="relative z-10 space-y-4">
            <h3 className="text-2xl font-bold text-white">Card Title 1</h3>
            <p className="text-gray-300">
              silver border
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="relative rounded-2xl bg-black/50 backdrop-blur-sm p-8 border border-zinc-800">
          <MovingBorder
            className="bg-gradient-to-r from-red-500 via-rose-400 to-red-500"
            size={100}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <div className="relative z-10 space-y-4">
            <h3 className="text-2xl font-bold text-white">Card Title 2</h3>
            <p className="text-gray-300">
                red border fast ani
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="relative rounded-2xl bg-transparent p-8">
          <MovingBorder
            className="bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500"
            size={90}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <div className="relative z-10 space-y-4">
            <h3 className="text-2xl font-bold text-white">Card Title 3</h3>
            <p className="text-gray-300">
              transparent background with blue border.
            </p>
          </div>
        </div>

        {/* Large Featured Card */}
        <div className="relative rounded-3xl bg-transparent p-10 md:col-span-2 lg:col-span-3">
          <MovingBorder
            className="bg-gradient-to-r from-gray-300 via-white to-gray-300"
            size={120}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              boxShadow: "0 0 50px rgba(200,200,200,0.5)",
            }}
          />
          <div className="relative z-10 space-y-6">
            <h2 className="text-4xl font-bold text-white">Featured Card</h2>
            <p className="text-gray-300 text-lg">
              Transparent adn slow bg-background
            </p>
          </div>
        </div>

      </div>
    
  )
}