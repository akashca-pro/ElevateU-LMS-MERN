import React from 'react'

const ProfileTeachers = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Teachers <span className="text-sm font-normal text-gray-500">(12)</span></h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search User"
                className="w-64 rounded-lg border border-gray-300 pl-10 pr-4 py-2"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <select className="rounded-lg border border-gray-300 px-4 py-2">
              <option>Relevance</option>
              <option>Newest</option>
              <option>Most Popular</option>
            </select>
            <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
              </svg>
              Filter
            </button>
          </div>
        </div>
  
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array(8).fill().map((_, i) => (
            <div key={i} className="rounded-lg border bg-white p-6 text-center">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/profile%20page%20(teachers)-pBnxZZ39G3cl7WcStPvN6vIrtnPc7b.png"
                alt=""
                className="mx-auto h-24 w-24 rounded-full"
              />
              <h3 className="mt-4 font-semibold">Ronald Richards</h3>
              <p className="text-sm text-gray-500">UI/UX Designer</p>
              <button className="mt-4 w-full rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
                Send Message
              </button>
            </div>
          ))}
        </div>
  
        <div className="mt-8 flex justify-center gap-2">
  {/* Previous Button */}
  <button className="rounded-lg border px-3 py-2 hover:bg-gray-50">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  </button>

  {/* Page Numbers */}
  {[1, 2, 3].map((page) => (
    <button
      key={page}
      className={`rounded-lg px-3 py-2 ${
        page === 1 ? "bg-purple-600 text-white" : "border hover:bg-gray-50"
      }`}
    >
      {page}
    </button>
  ))}

  {/* Next Button */}
  <button className="rounded-lg border px-3 py-2 hover:bg-gray-50">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
        clipRule="evenodd"
      />
    </svg>
  </button>
</div>
      </div>
  )
}

export default ProfileTeachers
