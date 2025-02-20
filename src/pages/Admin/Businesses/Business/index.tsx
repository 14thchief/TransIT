import styles from "./_styles.module.scss";
import PageLayout from "../../_components/PageLayout";
import TabSwitcher from "components/Global/TabSwitcher/TabSwitcher";
import { TabPanel } from "react-tabs";
import BusinessDetails from "./_components/BusinessDetails";
import { useDispatch } from "react-redux";
import { highlightBusiness } from "src/redux/features/admin/util/businessSlice";
import { ArrowLeft } from "src/assets/icons/icons";
import BusinessSettings from "./BusinessSettings";
import ManageAccount from "./BusinessSettings/components/ManageAccount";
import GatewaySetting from "./BusinessSettings/components/GatewaySetting";
import BusinessTransactions from "./BusinessTransactions";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import BusinessCustomFees from "./BusinessSettings/components/BusinessCustomFees";
import { useState, useEffect } from "react";
import ConvenienceFees from "./BusinessSettings/components/BusinessConvenienceFees";
import VirtualAccounts from "./VirtualAccounts";
import usePersistedBusiness from "src/hooks/usePersistentBusiness";
import useSessionUserRole from "src/hooks/useSessionUserRole";
import {
  hasAnyPermission,
  hasPermission,
} from "src/utilities/permissionBasedAccess";

const Business = () => {
  const { permissions } = useSessionUserRole({
    searchPermission: "business",
  });

  const { state } = useLocation();
  const [from, setFrom] = useState(state?.from);
  useEffect(() => {
    state?.from && setFrom(state.from);
  }, [state]);

  const { business: highlightedBusiness } = usePersistedBusiness();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("activeTab");
  const subPage = searchParams.get("subPage");

  const handleSetSubPage = (subPage: string) => {
    setSearchParams({ activeTab: "settings", subPage });
  };
  const displaySubPage = () => {
    if (highlightedBusiness) {
      switch (subPage?.toLowerCase()) {
        case "manage account":
          return <ManageAccount account={highlightedBusiness} />;
        case "gateway setting":
          return <GatewaySetting />;
        case "custom fees setting":
          return <BusinessCustomFees />;
        case "convenience fees setting":
          return <ConvenienceFees />;
        default:
          return null;
      }
    }
  };

  const businessSettings = hasAnyPermission(permissions, [
    "business-api-key:read",
    "business-payment-processor:read",
    "business-payment-method:read",
    "business-fee-settings:read",
    "business-fee-config:read",
    "business-settlement-account:read",
    "business-settlement:read",
    "business-status:read",
  ])
    ? {
        title: "settings",
        element: <BusinessSettings setSubPage={handleSetSubPage} />,
      }
    : null;

  const businessTransactions = hasPermission(
    permissions,
    "business-transaction:read"
  )
    ? {
        title: "transactions",
        element: <BusinessTransactions />,
      }
    : null;

  const businessVirtualAccounts = hasPermission(
    permissions,
    "business-settlement-account:read"
  )
    ? {
        title: "virtual accounts",
        element: <VirtualAccounts />,
      }
    : null;

  const tabs = [
    businessSettings,
    businessTransactions,
    businessVirtualAccounts,
  ];

  const defaultActiveTab = tabs?.filter((x) => x)?.[0]?.title;
  useEffect(() => {
    !activeTab &&
      defaultActiveTab &&
      setSearchParams({ activeTab: defaultActiveTab });

    return () => {
      // dispatch(highlightBusiness(null));
    };
  }, []);

  return (
    <PageLayout
      title={`Business`}
      goBack={from ?? "Business List"}
      goBackCb={() => {
        dispatch(highlightBusiness(null));
        from ? navigate(-1) : navigate("/admin/businesses");
      }}
    >
      <div className={`${styles.dashboard}`}>
        <BusinessDetails />
        <div className={styles.container}>
          {!subPage ? (
            <div className={styles.tabWrapper}>
              <TabSwitcher
                titles={tabs?.filter((x) => x)?.map((item: any) => item.title)}
                onTabChange={(title) => setSearchParams({ activeTab: title })}
                activeTab={activeTab}
              >
                {tabs
                  ?.filter((x) => x)
                  ?.map((item: any, i) => (
                    <TabPanel
                      selected={item.title.toLowerCase() === activeTab}
                      key={i}
                    >
                      {item.element}
                    </TabPanel>
                  ))}
              </TabSwitcher>
            </div>
          ) : (
            <div className={styles.subPage}>
              <div onClick={() => navigate(-1)} className={styles.goBack}>
                <ArrowLeft /> Back
              </div>
              {displaySubPage()}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Business;
