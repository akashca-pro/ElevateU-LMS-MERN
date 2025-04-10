// Format currency
export function formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(amount))
  }
  
  // Format date
  export function formatDate(dateString, includeTime = false) {
    const date = new Date(dateString)
  
    if (includeTime) {
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    }
  
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }
  
  // Function to combine class names
  export function cn(...classes) {
    return classes.filter(Boolean).join(" ")
  }
  