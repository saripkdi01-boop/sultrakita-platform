import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge conditional class names and resolve Tailwind conflicts.
 *
 * `clsx` flattens the conditional/array/object forms; `twMerge` then resolves
 * *conflicting utilities* so the last one wins instead of both being emitted.
 * Without the merge step, a component that does
 *
 *     <Button className="bg-danger" />   // variant already emits bg-primary
 *
 * would end up with both `bg-primary` and `bg-danger` in the class attribute
 * and the winner would depend on CSS source order — which changes whenever
 * Tailwind re-sorts. Merging makes the override deterministic.
 *
 * Kept in `lib/` because the UI spec explicitly allows UI-only utilities here
 * (`cn` is listed as an exception to the otherwise read-only `lib/` rule).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
