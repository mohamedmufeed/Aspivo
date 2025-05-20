 export const formatDateRange=(start: string, end: string): string =>{
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short' };

  const startDate = new Date(start).toLocaleDateString('en-US', options);
  const endDate = new Date(end).toLocaleDateString('en-US', options);

  return `${startDate} - ${endDate}`;
}
