export type ApiResponse<T> = {
  data: T;
  error?: string;
};

export type ApiError = {
  message: string;
  status: number;
};