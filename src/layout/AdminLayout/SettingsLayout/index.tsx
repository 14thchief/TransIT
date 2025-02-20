import { Outlet, useNavigate } from "react-router-dom";
import { settingsRoute } from "./data";
import styles from "./_styles.module.scss";
import { MdKeyboardArrowRight } from "react-icons/md";
import PageLayout from "src/pages/Admin/_components/PageLayout";

const Settingslayout = () => {
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname.includes(path);
  const isPermitted = (access: string) => {
    return access === "*";
  };

  return (
    <PageLayout
      title="Settings"
      description="Track and manage all settings on your dashboard"
      screen
    >
      <div className={styles.settings}>
        <div className={styles.settings_bar}>
          <ul className={styles.settings_routes}>
            {settingsRoute
              .filter(({ path, access }) => {
                if (isActive(path) && !isPermitted(access)) {
                  navigate("/admin/settings/fees-management");
                }
                return isPermitted(access);
              })
              .map(({ title, desc, path }, index) => (
                <li
                  key={index}
                  className={isActive(path) ? styles.active : ""}
                  onClick={() => navigate(path)}
                >
                  <div className={styles.titleDesc}>
                    <p>{title}</p>
                    <small>{desc}</small>
                  </div>
                  <MdKeyboardArrowRight />
                </li>
              ))}
          </ul>
        </div>

        <div className={styles.settings_body}>
          <Outlet />
        </div>
      </div>
    </PageLayout>
  );
};

export default Settingslayout;
