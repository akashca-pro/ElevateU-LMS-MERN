const Navigation = ({ activeTab, onTabChange ,tabs}) => {
   
     return (
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`py-4 px-1 relative ${
                activeTab === tab.id ? "text-[#7454FD] border-b-2 border-[#7454FD]" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    )
  }
  
  export default Navigation
  
  