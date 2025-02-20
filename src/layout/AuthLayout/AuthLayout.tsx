import { Outlet } from "react-router";
import styles from "./_styles.module.scss";
import { ReactNode } from "react";

const AuthLayout = ({ children }: { children?: ReactNode }) => {
  return (
    <div className={styles.auth_layout}>
      <div className={`${!children ? styles.body : ""}`}>
        {children || <Outlet />}
      </div>
    </div>
  );
};

export default AuthLayout;
