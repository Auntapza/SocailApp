import { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-hot-toast";

export function showToast<T>(
  promise: Promise<T>
) {
  return toast.promise(promise, {
    loading: "Loadding...",
    success: (res:AxiosResponse) => {
      return res.data.msg
    },
    error: (err: AxiosError | any) =>
        err.response?.data?.msg|| "An error occurred!",
  });
}
