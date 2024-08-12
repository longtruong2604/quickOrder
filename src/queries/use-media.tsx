import mediaApiRequest from "@/apiRequest/media";
import { useMutation } from "@tanstack/react-query";

export const useUploadMedia = () => {
  return useMutation({
    mutationFn: mediaApiRequest.upload,
  });
};
