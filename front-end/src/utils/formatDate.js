import { format } from "date-fns";

// handle format date
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return format(date, "dd/MM/yyy HH:mm:ss");
};
