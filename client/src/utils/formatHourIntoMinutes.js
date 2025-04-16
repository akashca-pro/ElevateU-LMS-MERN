export const formatMinutesToHours = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
  
    const hrPart = hrs > 0 ? `${hrs} hour${hrs > 1 ? 's' : ''}` : '';
    const minPart = mins > 0 ? `${mins} minute${mins > 1 ? 's' : ''}` : '';
  
    if (hrPart && minPart) return `${hrPart} ${minPart}`;
    return hrPart || minPart || '0 minutes';
  };