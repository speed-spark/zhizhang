export interface LoginResponse {
  data: {
    id: string;
    categoryMap: string;
  };
  message: string;
  ok: boolean;
}

export interface Category {
  label: string;
}
