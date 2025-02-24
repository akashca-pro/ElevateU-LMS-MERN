import React from 'react'

const ProfileMessages2 = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
    <div className="grid gap-8 md:grid-cols-[320px_1fr]">
      {/* Message List */}
      <div className="rounded-lg border bg-white">
        <div className="border-b p-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search messages"
              className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        <div className="divide-y">
          {Array(5)
            .fill()
            .map((_, i) => (
              <div key={i} className="flex gap-4 p-4 hover:bg-gray-50">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/profile%20page%20(message%202)-NEeddcEvvPt0sfBEkOiAMlGRFRiIbw.png"
                  alt=""
                  className="h-12 w-12 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Ronald Richards</h3>
                    <span className="text-sm text-gray-500">2m ago</span>
                  </div>
                  <p className="truncate text-sm text-gray-500">
                    Thank you for asking your doubt, I'll send you a pdf file which cover the problems you are
                    facing...
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex h-[600px] flex-col rounded-lg border bg-white">
        <div className="border-b p-4">
          <div className="flex items-center gap-4">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/profile%20page%20(message%202)-NEeddcEvvPt0sfBEkOiAMlGRFRiIbw.png"
              alt=""
              className="h-12 w-12 rounded-full"
            />
            <div>
              <h3 className="font-medium">Ronald Richards</h3>
              <p className="text-sm text-gray-500">UI/UX Designer</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="flex gap-4">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/profile%20page%20(message%202)-NEeddcEvvPt0sfBEkOiAMlGRFRiIbw.png"
              alt=""
              className="h-8 w-8 rounded-full"
            />
            <div className="rounded-lg bg-gray-100 p-3">
              <p>
                Hello! Thank you for reaching out to me. Feel free to ask any questions regarding the course, I will
                try to reply ASAP
              </p>
            </div>
          </div>
          <div className="flex flex-row-reverse gap-4">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/profile%20page-GiteHV5UJScHlrd4tHL5DsKiB6nzcO.png"
              alt=""
              className="h-8 w-8 rounded-full"
            />
            <div className="rounded-lg bg-purple-600 p-3 text-white">
              <p>Hello</p>
            </div>
          </div>
        </div>

        <div className="border-t p-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Type your message"
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2"
            />
            <button className="rounded-lg bg-purple-600 px-6 py-2 text-white hover:bg-purple-700">Send</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default ProfileMessages2
