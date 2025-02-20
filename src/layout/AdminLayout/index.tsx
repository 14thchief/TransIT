import { Outlet, useLocation, useOutletContext } from "react-router-dom";
import styles from "./_styles.module.scss";
import Sidebar from "./Sidebar";
import { BiMenu } from "react-icons/bi";
import useClickOutside from "src/hooks/useClickOutside";
import { Home } from "src/assets/icons/icons";
import Toggle from "components/Global/Toggle";
import { openActionModal } from "src/redux/features/util/actionModalSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectEnvironment, toggleEnvironment } from "src/redux/features/admin/util/environmentSlice";
import { MdKeyboardArrowRight } from "react-icons/md";
import { capitalize } from "lodash";

const AdminLayout = () => {
	const contextValue = useOutletContext();
	const dispatch = useDispatch();
	const location = useLocation();
	const currentPath = location.pathname?.replace(/%20/g, " ")?.split("/");
	const slicedPath = currentPath?.slice(2, currentPath.length);
	const { environment } = useSelector(selectEnvironment);
	const { open, setOpen, dropdownRef: sidebarRef } = useClickOutside();
	
	const handleToggleEnvironment = () => {
		dispatch(openActionModal({
			title: "Switch Environment",
			isOpen: true,
			type: "warning",
			content: `You are about to switch to the ${environment === "live"? "Test" : "Live"} environment.`,
			callback: ()=> {
				dispatch(toggleEnvironment());
			},
			callbackText: "Confirm",
			cancelText: "Cancel"
		}))
	}

	return (
		<div className={styles.admin_layout}>
			<Sidebar open={open} setOpen={setOpen} ref={sidebarRef} />
			<main>
				<div className={styles.navHeader}>
					<div className={styles.breadCrumb}>
						<button className={styles.mobileToggleButton}>
							<BiMenu size={28} onClick={() => setOpen((prev) => !prev)} />
						</button>

						<p>
							<Home size={16} /> 
							{slicedPath?.map((item, key)=> {

								return (
									<span key={key}>
									{capitalize(item)}
									{key !== (slicedPath?.length -1) && <MdKeyboardArrowRight />}
									</span>
								)
							})} 
						</p>
					</div>
					<div className={styles.functions}>					
						<label 
							className={`
								${styles.toggleLabel}
								${environment === "live"?
									styles.green
									: styles.red
								}
							`}
						>
							<Toggle
								id={'transaction_live_mode'}
								checked={environment === "live"}
								onChange={()=> handleToggleEnvironment()}
								offColor="#C7001D"
								onColor="#01821D"
							/>
							{environment} Mode
						</label>
					</div>
				</div>
				<div
					className={`${styles.outletContainer}`}
				>
					<Outlet context={contextValue} />
				</div>
			</main>
		</div>
	);
};

export default AdminLayout;
