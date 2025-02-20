import { Outlet } from "react-router";
import styles from "./_styles.module.scss";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import Logo from "components/Global/Logo";

const AuthLayout = ({ children }: { children?: ReactNode }) => {
  return (
    <div className={styles.auth_layout}>
      {/* <header>
				<p>Don't have an account?</p>
				<Link to={} />
			</header> */}

      <div className={`${!children ? styles.body : ""}`}>
        {children || <Outlet />}
      </div>
    </div>
  );
};

export default AuthLayout;
