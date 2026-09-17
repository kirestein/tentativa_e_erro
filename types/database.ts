export type Activity = {
  id: string;
  title: string;
  theme: string;
  description: string | null;
  pdf_path: string;
  lesson_plan_path: string | null;
  cover_path: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type ActivityComment = {
  id: string;
  activity_id: string;
  author_name: string;
  body: string;
  created_at: string;
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
