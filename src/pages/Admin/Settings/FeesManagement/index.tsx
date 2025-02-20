import PageLayout from "../../_components/PageLayout";
// import styles from "./styles.module.scss";
import TabSwitcher from "components/Global/TabSwitcher/TabSwitcher";
import { useEffect, useState } from "react";
import { TabPanel } from "react-tabs";
import GlobalFees from "./tabs/GlobalFees";
import CustomFees from "./tabs/CustomFees";
import { useSearchParams } from "react-router-dom";
import ConvenienceFees from "./tabs/ConvenienceFees";

const FeesManagement = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentTab, setCurrentTab] = useState(
    searchParams.get("fee-tab") || "Global Fees"
  );
  useEffect(() => {
    searchParams.set("fee-tab", currentTab);
    setSearchParams(searchParams);
  }, [currentTab]);

  const tabs = [
    {
      title: "Global Fees",
      element: <GlobalFees />,
    },
    {
      title: "Custom Fees",
      element: <CustomFees />,
    },
    {
      title: "Convenience Fees",
      element: <ConvenienceFees />,
    },
  ];

  return (
    <PageLayout>
      <TabSwitcher
        titles={tabs?.map((item) => item.title)}
        onTabChange={(title) => {
          setCurrentTab(title);
        }}
        activeTab={searchParams.get("fee-tab")}
      >
        {tabs?.map((item, i) => (
          <TabPanel
            selected={
              item.title.toLowerCase() ===
              searchParams.get("fee-tab")?.toLowerCase()
            }
            key={i}
          >
            {item.element}
          </TabPanel>
        ))}
      </TabSwitcher>
    </PageLayout>
  );
};

export default FeesManagement;
