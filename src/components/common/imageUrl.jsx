// export const getImageUrl = (path) => {
//   if (path.startsWith("http://") || path.startsWith("https://")) {
//     return path;
//   } else {
//     const baseUrl = "http://10.10.7.46:5000";
//     return `${baseUrl}/${path}`;
//   }
// };
export const getImageUrl = (path) => {
  // const baseUrl = import.meta?.env?.VITE_API_URL || "http://10.10.7.44:5000";
  const baseUrl = import.meta?.env?.VITE_API_URL || "https://api.glassfile.xyz";

  // If path is missing or not a string, return a default placeholder
  if (!path || typeof path !== "string") {
    return "/images/default-avatar.png"; // local placeholder
  }

  // If it's a blob or data URL (local preview), return as-is
  if (path.startsWith("blob:") || path.startsWith("data:")) return path;

  // If path is already a full URL, return it as is
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // If path starts with a slash, avoid double slashes
  if (path.startsWith("/")) return `${baseUrl}${path}`;

  // Otherwise, prepend your base URL
  return `${baseUrl}/${path}`;
};
