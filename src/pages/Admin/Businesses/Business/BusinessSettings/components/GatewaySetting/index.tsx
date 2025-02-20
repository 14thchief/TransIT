import styles from "./styles.module.scss";
import TabSwitcher from "components/Global/TabSwitcher/TabSwitcher";
import { TabPanel } from "react-tabs";
import PaymentGateways from "./components/PaymentGateways";
import PaymentMethods from "./components/PaymentMethods";
import SettlementAccounts from "./components/SettlementAccounts";
import SubAccounts from "./components/SubAccounts";
import APIKeys from "./components/APIKeys";
import FeeSetting from "./components/FeeSetting";
import { hasPermission } from "src/utilities/permissionBasedAccess";
import useSessionUserRole from "src/hooks/useSessionUserRole";

const GatewaySetting = () => {
  const { permissions } = useSessionUserRole();

  const apiKey = hasPermission(permissions, "business-api-key:read")
    ? {
        title: "API Keys",
        element: <APIKeys />,
      }
    : null;
  const paymentGateways = hasPermission(
    permissions,
    "business-payment-processor:read"
  )
    ? {
        title: "Payment Gateways",
        element: <PaymentGateways />,
      }
    : null;
  const paymentMethods = hasPermission(
    permissions,
    "business-payment-method:read"
  )
    ? {
        title: "Payment Methods",
        element: <PaymentMethods />,
      }
    : null;
  const feeSettings = hasPermission(permissions, "business-fee-config:read")
    ? {
        title: "Fee Setting",
        element: <FeeSetting />,
      }
    : null;
  const settlementAccounts = hasPermission(
    permissions,
    "business-settlement-account:read"
  )
    ? {
        title: "Settlement Accounts",
        element: <SettlementAccounts />,
      }
    : null;
  const subAccounts = hasPermission(
    permissions,
    "business-settlement-account:read"
  )
    ? {
        title: "Sub Accounts",
        element: <SubAccounts />,
      }
    : null;

  const tabs = [
    apiKey,
    paymentGateways,
    paymentMethods,
    feeSettings,
    settlementAccounts,
    subAccounts,
  ];

  return (
    <div className={styles.container}>
      <div className={styles.tabWrapper}>
        <TabSwitcher
          titles={tabs?.filter((x) => x)?.map((item: any) => item.title)}
          onTabChange={() => {}}
        >
          {tabs
            ?.filter((x) => x)
            ?.map((item: any, i) => (
              <TabPanel key={i}>{item.element}</TabPanel>
            ))}
        </TabSwitcher>
      </div>
    </div>
  );
};

export default GatewaySetting;
