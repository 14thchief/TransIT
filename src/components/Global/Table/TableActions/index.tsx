import { Delete, Edit, Eye, DownloadCloud } from "src/assets/icons/icons";
import styles from "./_styles.module.scss";
import { Fragment, ReactNode } from "react";

type TableActionsProps = {
  actions: {
    type: "view" | "edit" | "delete" | "download";
    clickAction: () => void;
    color?: string;
    component?: ReactNode
  }[];
};

const TableActions = ({ actions }: TableActionsProps) => {
  const icons = {
    view: (clickAction: () => void, color?: string) => (
      <Eye
        size={16}
        color={color}
        style={{ cursor: "pointer" }}
        onClick={clickAction}
      />
    ),
    edit: (clickAction: () => void, color?: string) => (
      <Edit
        size={16}
        color={color}
        style={{ cursor: "pointer" }}
        onClick={clickAction}
      />
    ),
    delete: (clickAction: () => void, color?: string) => (
      <Delete
        size={16}
        color={color}
        style={{ cursor: "pointer" }}
        onClick={clickAction}
      />
    ),
    download: (clickAction: () => void, color?: string, component?:ReactNode) => (
      component?? 
      <DownloadCloud
        size={16}
        color={color}
        style={{ cursor: "pointer" }}
        onClick={clickAction}
      />
    ),
  };
  return (
    <div className={styles.table_actions}>
      {actions.map((action) => {
        const { type, clickAction, color, component } = action;
        const actionIcon = icons[type];
        return <Fragment key={type}>{actionIcon(clickAction, color, component)}</Fragment>;
      })}
    </div>
  );
};
export default TableActions;
