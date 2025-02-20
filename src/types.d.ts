type UserAccount = {
  name?: string;
  id: string;
  email?: string;
};

type EnvironmentType = "live" | "test";

type MetaGlobal = {
  next_page: number;
  previous_page: number;
  current_page: number;
  per_page: number;
  total_pages: number;
};

type StatusTypes =
  | "All"
  | "Pending"
  | "Paid"
  | "Settled"
  | "Failed"
  | "Suspended"
  | "Completed"
  | "Reversed"
  | "Active"
  | "Inactive";
