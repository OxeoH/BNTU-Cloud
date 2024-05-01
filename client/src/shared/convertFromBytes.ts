export const convertFromBytes = (bytes: bigint): string => {
  const kilobyte = BigInt(1024);
  const megabyte = kilobyte * BigInt(1024);
  const gigabyte = megabyte * BigInt(1024);
  const terrabyte = gigabyte * BigInt(1024);

  if (BigInt(bytes) < kilobyte) {
    return BigInt(bytes).toString() + " bytes";
  } else if (BigInt(bytes) < megabyte) {
    return (Number(bytes) / Number(kilobyte)).toFixed(2) + " KB";
  } else if (BigInt(bytes) < gigabyte) {
    return (Number(bytes) / Number(megabyte)).toFixed(2) + " MB";
  } else if (BigInt(bytes) < terrabyte) {
    return (Number(bytes) / Number(gigabyte)).toFixed(2) + " GB";
  } else {
    return (Number(bytes) / Number(terrabyte)).toFixed(2) + " TB";
  }
};
