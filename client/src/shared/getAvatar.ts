export const getAvatar = (name: string, avatar: string) => {
  const symbols = `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`;
  if (!avatar.length) return { children: symbols };
  return { src: process.env.REACT_APP_API_URL + avatar, alt: symbols };
};
