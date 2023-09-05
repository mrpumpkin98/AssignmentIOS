export function getCurrentFormattedDateTime(): string {
  const today = new Date();
  const formattedDate = `${today.getFullYear()}.${(today.getMonth() + 1)
    .toString()
    .padStart(2, "0")}.${today.getDate().toString().padStart(2, "0")}`;
  const formattedTime = today.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${formattedDate}`;
}

export function formatTimestamp(timestamp: any) {
  const options = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  return new Intl.DateTimeFormat("ko-KR", options).format(timestamp.toDate());
}
