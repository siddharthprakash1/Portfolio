// Create a utils folder and an index.ts file inside it.
// utils/index.ts

export function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
  }
  