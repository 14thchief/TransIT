import Logo from "components/Global/Logo";
import styles from "./_styles.module.scss";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { sidebarData } from "./data";
import { Dispatch, RefObject, SetStateAction, useEffect } from "react";
import { BiX } from "react-icons/bi";
import useGetWindowDimension from "src/hooks/useGetWindowDimension";
import { Logout, UserAvatar } from "src/assets/icons/icons";
import { useDispatch } from "react-redux";
import { logout } from "src/redux/features/auth/util/logoutSlice";
import usePersistentAuth from "src/hooks/usePersistentAuth";
import { openActionModal } from "src/redux/features/util/actionModalSlice";
import { highlightBusiness } from "src/redux/features/admin/util/businessSlice";
import {
  getModulePermissions,
  hasAnyPermission,
} from "src/utilities/permissionBasedAccess";
import useSessionUserRole, {
  usePermissions,
} from "src/hooks/useSessionUserRole";

const Sidebar = (props: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  ref: RefObject<HTMLElement>;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { sessionUser } = usePersistentAuth();
  const { isMobile } = useGetWindowDimension();
  const { permissions } = useSessionUserRole();
  const allPermissions = usePermissions();
  const isActive = (path: string) => location.pathname.includes(path);

  useEffect(() => {
    const last_path = sessionStorage.getItem("last_path");
    last_path && navigate(last_path);
  }, []);

  const permittedSidebarRoutes = sidebarData.topRoutes
    .map((x) => ({
      ...x,
      permissions: getModulePermissions(
        x.permissionName.toLowerCase(),
        allPermissions
      ),
    }))
    .filter(
      (s) => s.access === "*" && hasAnyPermission(permissions, s.permissions)
    );

  const handleClickPath = (path: string) => {
    navigate(path);
    sessionStorage.setItem("last_path", path);
    props.setOpen(false);

    // Reset Global states
    dispatch(highlightBusiness(null));
  };

  const handleLogout = () => {
    dispatch(
      openActionModal({
        title: "Confirm Logout",
        isOpen: true,
        type: "warning",
        content: `Are you sure you want to Logout of this session?`,
        callback: () => {
          dispatch(logout());
          navigate("/auth/login");
        },
        callbackText: "Logout",
        cancelText: "Cancel",
      })
    );
  };

  return (
    <div
      className={`${
        isMobile && props.open ? styles.mobileSidebarContainer : ""
      }`}
    >
      <div
        className={`${styles.sidebar} ${
          !isMobile ? "" : props.open ? styles.open : styles.closed
        }`}
      >
        <div className={styles.routes}>
          <div className={styles.logoContainer}>
            <div className={styles.logo}>
              <Link to="/admin">
                <Logo />
              </Link>
            </div>
            {isMobile && (
              <button onClick={() => props.setOpen((prev) => !prev)}>
                <BiX size={32} />
              </button>
            )}
          </div>

          <ul className={styles.sidebar_routes}>
            {permittedSidebarRoutes.map(
              ({ title, icon, path }, index) =>
                title && (
                  <li
                    key={index}
                    className={isActive(path) ? styles.active : ""}
                    onClick={() => handleClickPath(path)}
                  >
                    <span>{icon}</span> {title}
                  </li>
                )
            )}
          </ul>
        </div>
        <div className={styles.static_routes}>
          <hr className={styles.line} />

          <div className={styles.user}>
            <div className={styles.user_link}>
              <UserAvatar size={32} className={styles.profileIcon} />
              <div className={styles.username}>
                <p className={styles.email}>{sessionUser?.email ?? ""}</p>
              </div>
            </div>

            <Logout
              size={20}
              className={styles.logout}
              onClick={handleLogout}
            />
          </div>
        </div>
      </div>

      <div
        className={styles.obfuscator}
        onClick={() => props.setOpen((prev) => !prev)}
      ></div>
    </div>
  );
};
export default Sidebar;
