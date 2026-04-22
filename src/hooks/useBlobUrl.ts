import { useEffect, useState } from "react";

export function useBlobUrl(remoteUrl: string): string {
  const [blobUrl, setBlobUrl] = useState(remoteUrl);

  useEffect(() => {
    let objectUrl = "";
    fetch(remoteUrl)
      .then((r) => r.blob())
      .then((blob) => {
        objectUrl = URL.createObjectURL(blob);
        setBlobUrl(objectUrl);
      })
      .catch(() => {});

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [remoteUrl]);

  return blobUrl;
}
