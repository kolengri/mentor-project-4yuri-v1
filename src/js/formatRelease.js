import { format, parseISO } from 'date-fns';

export const formatReleaseDate = (date) => {
  try {
    return format(parseISO(date), "MMMM yyyy");
  } catch (error) {
    return null;
  }
};
