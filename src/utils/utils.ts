export const formatDateAttribute = (date: string) =>
  new Date(date).toLocaleString('ru', {
    month: 'long',
    day: 'numeric',
  });

export const debounce = <A extends string[]>(callback: (...params: A) => void, timeoutDelay = 500) => {
  let timeoutId: NodeJS.Timeout;
  return (...params: A) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...params), timeoutDelay);
  };
};

