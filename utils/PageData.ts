export function parseDate(dateString: string) {
  const dateObject = new Date(dateString);

  // Check if the dateObject is valid
  if (isNaN(dateObject.getTime())) {
    // Invalid date
    return null;
  }

  // Extract individual components
  const year = dateObject.getFullYear();
  const month = dateObject.getMonth() + 1; // Months are zero-based, so add 1
  const day = dateObject.getDate();

  return {
    year,
    month,
    day,
  };
}
