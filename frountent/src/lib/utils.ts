// simple className merge utility
export function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
