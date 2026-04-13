export function validateTitle(title: string): boolean {
  const titleRegex = /^[a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ0-9\s._\-'’]+$/;
  return titleRegex.test(title.trim());
}
