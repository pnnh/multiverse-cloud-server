export function formatRfc3339 (date: string | Date): string {
  if (typeof date === 'string') {
    const parsedDate = new Date(date)
    return `${parsedDate.getFullYear()}年${parsedDate.getMonth() + 1}月${parsedDate.getDate()}日`
  } else if (date instanceof Date) {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
  }
  return ''
}