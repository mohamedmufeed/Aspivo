import { format, startOfWeek, endOfWeek, subWeeks, parse } from 'date-fns';
 export const getLastNWeeks = (n: number) => {
    const weeks = [];
    for (let i = 0; i < n; i++) {
      const start = startOfWeek(subWeeks(new Date(), i), { weekStartsOn: 1 }); 
      const end = endOfWeek(subWeeks(new Date(), i), { weekStartsOn: 1 });     
      weeks.push(`${format(start, 'MMM d')} - ${format(end, 'MMM d')}`);
    }
    return weeks;
  };


export const parseWeekRange = (label: string): { startDate: string; endDate: string } => {
  const [startStr, endStr] = label.split(" - ");
  const year = new Date().getFullYear();
  const startDate = parse(`${startStr} ${year}`, "MMM d yyyy", new Date());
  const endDate = parse(`${endStr} ${year}`, "MMM d yyyy", new Date());
  return {
    startDate: format(startDate, "yyyy-MM-dd"),
    endDate: format(endDate, "yyyy-MM-dd"),
  };
};


 export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};
