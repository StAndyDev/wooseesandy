export function formatDateInterval(fromISO: string, toISO: string, showSeconds?: boolean): string {
  const from = new Date(fromISO).getTime();
  const to = new Date(toISO).getTime();
  let diff = Math.max(from - to, 0); // en ms

  // auto-set showSeconds if not explicitly passed
  const autoShowSeconds = diff < 60 * 1000;
  const displaySeconds = showSeconds ?? autoShowSeconds;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff %= (1000 * 60 * 60 * 24);

  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff %= (1000 * 60 * 60);

  const minutes = Math.floor(diff / (1000 * 60));
  diff %= (1000 * 60);

  const seconds = Math.floor(diff / 1000);

  let result = "";
  if (days > 0) result += `${days}j `;
  if (hours > 0) result += `${hours}h `;
  if (minutes > 0) result += `${minutes}mn `;
  if (displaySeconds && seconds >= 0) result += `${seconds}s`;

  return result.trim();
}

export function formatDurationISO(durationISO: string, showSeconds: boolean = false): string {
  const regex = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/;
  const matches = durationISO.match(regex);

  if (!matches) return showSeconds ? "0s" : "0mn";

  const days = parseInt(matches[1] || "0", 10);
  const hours = parseInt(matches[2] || "0", 10);
  const minutes = parseInt(matches[3] || "0", 10);
  const seconds = parseInt(matches[4] || "0", 10);

  let result = "";
  if (days > 0) result += `${days}j `;
  if (hours > 0) result += `${hours}h `;
  if (minutes > 0 || (!showSeconds && result === "")) result += `${minutes}mn `;
  if (showSeconds && (seconds > 0 || result === "")) result += `${seconds}s`;

  return result.trim();
}  
