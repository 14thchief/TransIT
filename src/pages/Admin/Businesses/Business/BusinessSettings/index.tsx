import { ArrowRight } from "src/assets/icons/icons";
import styles from "./styles.module.scss";
import { GrGateway, GrVmMaintenance } from "react-icons/gr";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { BiMoneyWithdraw } from "react-icons/bi";
import { hasPermission } from "src/utilities/permissionBasedAccess";
import useSessionUserRole from "src/hooks/useSessionUserRole";
import IconWithBackground from "components/Global/IconWithBackground";

const BusinessSettings = ({
  setSubPage,
}: {
  setSubPage: (title: string) => void;
}) => {
  const { permissions } = useSessionUserRole();

  const convenienceFee = hasPermission(
    permissions,
    "business-fee-settings:read"
  )
    ? {
        title: "Convenience Fees Setting",
        icon: (
          <IconWithBackground
            element={<BiMoneyWithdraw color="#01821D" size={20} />}
            bgColor="#F0FFF3"
          />
        ),
      }
    : null;

  const customFee = hasPermission(permissions, "business-fee-settings:read")
    ? {
        title: "Custom Fees Setting",
        icon: (
          <IconWithBackground
            element={<RiMoneyDollarCircleLine color="#01821D" size={20} />}
            bgColor="#F0FFF3"
          />
        ),
      }
    : null;

  const gatewaySetting = {
    title: "Gateway Setting",
    icon: (
      <IconWithBackground
        element={<GrGateway color="#D61F69" size={17} />}
        bgColor="#FCE8F3"
      />
    ),
  };

  const manageAccount = hasPermission(permissions, "business-status:read")
    ? {
        title: "Manage Account",
        icon: (
          <IconWithBackground
            element={<GrVmMaintenance color="#1D40C0" size={17} />}
            bgColor="#F2F4FD"
          />
        ),
      }
    : null;

  const settings = [manageAccount, gatewaySetting, customFee, convenienceFee];

  return (
    <div className={styles.container}>
      {settings
        .filter((x) => x?.icon && x.title)
        ?.map((item: any, i) => {
          return (
            <div
              onClick={() => setSubPage(item.title)}
              key={i}
              className={styles.card}
            >
              {item.icon}
              {item.title}
              <ArrowRight />
            </div>
          );
        })}
    </div>
  );
};

export default BusinessSettings;
