import { ChangeEvent, useState } from "react";

const useFile = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setPreview(fileURL);
      setFile(file);
    } else {
      setPreview("Can not preview this file");
    }
  };

  return { handleFileChange, file, preview, setPreview };
};

export default useFile;
