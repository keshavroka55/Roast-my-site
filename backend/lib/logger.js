export function log(tag, ...args) {
  console.log(`[${tag}]`, ...args);
}
export function warn(tag, ...args) {
  console.warn(`[${tag}]`, ...args);
}
export function error(tag, ...args) {
  console.error(`[${tag}]`, ...args);
}