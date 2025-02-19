const Footer = () => {
    return (
      <footer className="bg-[#1D1042] text-white">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-purple-600" />
                <span className="text-xl font-bold">ElevateU</span>
              </div>
              <p className="mt-4 text-sm text-gray-300">
                Empowering learners through accessible and engaging online education.
              </p>
            </div>
  
            <div>
              <h3 className="font-semibold">Get Help</h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-300">
                <li>Contact Us</li>
                <li>Latest Articles</li>
                <li>FAQ</li>
              </ul>
            </div>
  
            <div>
              <h3 className="font-semibold">Programs</h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-300">
                <li>Art & Design</li>
                <li>Business</li>
                <li>IT & Software</li>
                <li>Languages</li>
                <li>Programming</li>
              </ul>
            </div>
  
            <div>
              <h3 className="font-semibold">Contact Us</h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-300">
                <li>Address: 123 Main Street, Anytown, CA 12345</li>
                <li>Tel: +(123) 456-7890</li>
                <li>Mail: bywayedu@webkul.in</li>
              </ul>
            </div>
          </div>
  
          <div className="mt-8 flex items-center justify-between border-t border-gray-700 pt-8">
            <p className="text-sm text-gray-300">© 2024 ElevateU. All rights reserved.</p>
            <div className="flex gap-4">
              {["facebook", "github", "google", "twitter", "microsoft"].map((social) => (
                <a
                  key={social}
                  href={`https://${social}.com`}
                  className="rounded-full bg-white/10 p-2 hover:bg-white/20"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="sr-only">{social}</span>
                  <div className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    )
  }
  
  export default Footer
  
  