export const formatDate = (dateString) => {
    if (!dateString) return ""; // Handle empty input
  
    const date = new Date(dateString);
    if (isNaN(date)) return ""; // Handle invalid date
  
    return date.toISOString().split("T")[0]; // Returns "YYYY-MM-DD"
  };