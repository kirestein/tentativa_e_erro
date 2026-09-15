export type Activity = {
  id: string;
  title: string;
  theme: string;
  description: string | null;
  pdf_path: string;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type Game = {
  id: string;
  title: string;
  theme: string | null;
  description: string | null;
  storage_prefix: string;
  published: boolean;
  created_at: string;
  updated_at: string;
};
