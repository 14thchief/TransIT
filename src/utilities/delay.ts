export const delay = (time = 800) =>
  new Promise<void>((res) => setTimeout(() => res(), time));
