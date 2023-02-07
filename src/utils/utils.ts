export const formatDateAttribute = (date: string) =>
  new Date(date).toLocaleString("ru", {
    month: "long",
    day: "numeric",
  });