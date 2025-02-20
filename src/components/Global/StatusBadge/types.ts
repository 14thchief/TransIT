import { ReactNode } from "react";

export type Status =
  | "approved"
  | "rejected"
  | "failed"
  | "completed"
  | "success"
  | "error"
  | "pending"
  | "active"
  | "inactive"
  | "paid"
  | "part-payment"
  | "unavailable";

export interface StatusBadgeProps {
  status: Status;
  children: ReactNode;
  textOnly?: boolean;
  noBackground?: boolean;
}
