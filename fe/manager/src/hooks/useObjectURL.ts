import { useEffect, useMemo } from "react";

const useObjectURL = (file: File | Blob) => {
  const url = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [url]);

  return url;
};

export default useObjectURL;
