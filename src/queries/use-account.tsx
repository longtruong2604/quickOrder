import accountApiRequest from "@/apiRequest/account";
import { AccountResType } from "@/schemaValidations/account.schema";
import { useQuery } from "@tanstack/react-query";

export const useAccountQuery = (onSuccess?: (data:AccountResType) => void) => {
  return useQuery({
    queryKey: ["account-profile"],
    queryFn: accountApiRequest.me,
  });
};
