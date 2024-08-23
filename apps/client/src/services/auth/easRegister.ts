import { AuthResponseDto, RegisterDto } from "@reactive-resume/dto";
import { useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import { axios } from "@/client/libs/axios";
import { queryClient } from "@/client/libs/query-client";
import { useAuthStore } from "@/client/stores/auth";

export const easRegister = async (data: RegisterDto) => {
  const response = await axios.post<AuthResponseDto, AxiosResponse<AuthResponseDto>, RegisterDto>(
    "/auth/easRegister",
    data,
  );

  return response.data;
};

export const useEasRegister = () => {
  const setUser = useAuthStore((state) => state.setUser);

  const {
    error,
    isPending: loading,
    mutateAsync: registerFn,
  } = useMutation({
    mutationFn: easRegister,
    onSuccess: (data) => {
      setUser(data.user);
      queryClient.setQueryData(["user"], data.user);
    },
  });

  return { easRegister: registerFn, loading, error };
};
