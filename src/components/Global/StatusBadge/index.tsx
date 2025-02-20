import React from "react";
import { StatusBadgeProps } from "./types";
import styles from "./_styles.module.scss";

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, children, textOnly, noBackground }) => {
  return (
    <div className={`
      ${styles.status_badge} 
      ${styles[status?.toLowerCase()]} 
      ${textOnly && styles.textOnly} 
      ${noBackground && styles.noBackground}
    `}>{children}</div>
  );
};

export default StatusBadge;
