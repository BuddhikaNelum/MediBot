import dayjs from "dayjs";

export const DateFormat = {
  FORMAT_1: "YYYY-MM-DD",
  FORMAT_2: "YYYY-MM-DD hh:mm a",
} as const;

const formatDateTime = (dateStr: string, format: string) => {
  return dayjs(dateStr).format(format);
}

const isValidDate = (dateStr: string) => {
  const d = dayjs(dateStr);
  
  if (d.isValid()) {
    return d.isAfter(dayjs(), 'day');
  }
}

export {
  formatDateTime,
  isValidDate,
}