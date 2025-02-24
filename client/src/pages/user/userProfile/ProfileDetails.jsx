import React from 'react'

const ProfileDetails = () => {
  return (
    <div className="space-y-6">
            <div className="rounded-lg border bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold">Personal Information</h3>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                    placeholder="Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            </div>
  
            <div className="rounded-lg border bg-white p-6">
              <h3 className="mb-4 text-lg font-semibold">Social Links</h3>
              <div className="space-y-4">
                {["Website", "Twitter", "LinkedIn", "GitHub"].map((platform) => (
                  <div key={platform}>
                    <label className="block text-sm font-medium text-gray-700">{platform}</label>
                    <input
                      type="url"
                      className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2"
                      placeholder={`https://${platform.toLowerCase()}.com/username`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
  )
}

export default ProfileDetails
