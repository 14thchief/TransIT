import styles from "./_styles.module.scss";
import Toggle from "components/Global/Toggle";
import PageLayout from "src/pages/Admin/_components/PageLayout";
import usePersistedBusiness from "src/hooks/usePersistentBusiness";
import {
  useGetBusinessActivationStatusQuery,
  useInitiateSettlementMutation,
  useLazyGetVirtualAccountsQuery,
  useOnboardBusinessSettlementMutation,
  useToggleBusinessSettlementMutation,
} from "src/redux/features/admin/virtualAccountSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openActionModal } from "src/redux/features/util/actionModalSlice";
import SplitRules from "./components/SplitRules";
import TabSwitcher from "components/Global/TabSwitcher/TabSwitcher";
import { TabPanel } from "react-tabs";
import { selectEnvironment } from "src/redux/features/admin/util/environmentSlice";
import { toast } from "react-toastify";
import {
  Account,
  VirtualAccountResponse,
} from "src/redux/features/admin/types/virtualAccountType";
import EmptyData from "components/Global/EmptyData";
import empty from "../../../../../assets/images/empty.png";
import Table from "components/Global/Table";
import SettlementHistory from "./components/SettlementHistory";
import { useSearchParams } from "react-router-dom";
import { TableColumn } from "components/Global/Table/types";
import { createColumnHelper } from "@tanstack/react-table";
import { Eye } from "src/assets/icons/icons";
import { formatCurrency } from "src/utilities/formatCurrency";
import wema from "../../../../../assets/svg/wema.svg";
import Search from "components/Global/Search";
import Button from "components/Core/Button";

const VirtualAccounts = () => {
  const dispatch = useDispatch();
  const { environment } = useSelector(selectEnvironment);
  const { business } = usePersistedBusiness();

  const queryOptions: any = {
    businessId: business?.uuid,
    environment,
  };

  const [toggleSettlementActivation, { isLoading: isToggling }] =
    useToggleBusinessSettlementMutation();
  const [onboardBusiness, { isLoading: isOnboarding }] =
    useOnboardBusinessSettlementMutation();
  useEffect(() => {
    let toastId;
    if (isOnboarding) {
      toastId = toast.loading("Onboarding Settlement Service...");
    } else if (isToggling) {
      toastId = toast.loading("Toggling Settlement Service...");
    } else {
      toast.dismiss(toastId);
    }
  }, [isToggling, isOnboarding]);

  const { data: activationResponse } = useGetBusinessActivationStatusQuery(
    queryOptions,
    { skip: !business?.uuid }
  );
  const activationStatus =
    activationResponse?.status?.toLowerCase() === "active" ? true : false;

  const [searchTerm, setSearchTerm] = useState("");
  const [fetchVirtualAccounts, { isLoading }] =
    useLazyGetVirtualAccountsQuery();
  const [virtualAccounts, setVirtualAccounts] = useState<
    VirtualAccountResponse["data"]
  >([]);
  const filteredVirtualAccounts = virtualAccounts?.filter((x) =>
    x.accountNumber.includes(searchTerm)
  );
  useEffect(() => {
    if (activationStatus) {
      handleFetchVirtualAccounts();
    }
  }, [activationStatus, environment]);

  const handleFetchVirtualAccounts = () => {
    fetchVirtualAccounts(queryOptions)
      .unwrap()
      .then(({ data }) => {
        data && setVirtualAccounts(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const [InitiateSettlement, { isLoading: isInitiating }] =
    useInitiateSettlementMutation();
  const handleInitiateSettlement = () => {
    if (!business?.uuid) return;

    InitiateSettlement(business?.uuid)
      .unwrap()
      .then((data) => {
        console.log({ data });
        toast.success("Initiated Successfully!");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error Initiating Settlement, Please try again.");
      });
  };

  // ONE-TIME Onboard a business
  const handleOnboardBusiness = () => {
    onboardBusiness({
      businessUUID: business?.uuid as string,
      name: business?.name as string,
      email: business?.email as string,
      phoneNumber: (business?.phoneNumber || business?.phone_number) as string,
    })
      .unwrap()
      .then(() => {
        handleFetchVirtualAccounts();
      })
      .catch((error) => console.error({ error }));
  };

  // Subsequent Toggle of activation status
  const handleToggleSettlementService = () => {
    toggleSettlementActivation({
      businessId: business?.uuid as string,
      newStatus: !activationStatus,
    })
      .unwrap()
      .then(() => {
        handleFetchVirtualAccounts();
      })
      .catch((error) => console.error({ error }));
  };

  // Combining the above 2
  const handleToggle = () => {
    dispatch(
      openActionModal({
        isOpen: true,
        type: "warning",
        title: `${
          activationStatus ? "Deactivate" : "Activate"
        } Settlement Service`,
        content: `You are about to ${
          activationStatus ? "Deactivate" : "Activate"
        } settlement service for this Business.`,
        callback: activationResponse
          ? handleToggleSettlementService
          : handleOnboardBusiness,
        cancelText: "Cancel",
      })
    );
  };

  // Select a VA
  const [selectedVA, setSelectedVA] = useState<null | Account>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectVirtualAccount = (account: Account) => {
    setSearchParams({
      account: account.id.toString(),
    });
    setSelectedVA(account);
  };
  const isTabsPage = !!searchParams.get("account");

  const unselectVirtualAccount = () => {
    setSearchParams({});
  };

  const columnHelper = createColumnHelper<Account>();
  const virtualAccountsColumn: TableColumn<Account>[] = [
    {
      header: "Account Name",
      accessorFn: (rowData) => rowData.accountName,
      enableSorting: false,
    },
    {
      header: "Account Number",
      accessorFn: (rowData) => rowData.accountNumber,
      enableSorting: false,
    },
    {
      header: "Balance",
      accessorFn: (rowData) =>
        formatCurrency(parseFloat(rowData.accountBalance)),
      enableSorting: false,
    },
    {
      header: "Bank",
      cell: () => (
        <div className={styles.accountDisplay}>
          <div className={styles.imgWrap}>
            <img src={wema} alt="wema_bank" />
          </div>
          <p>ALAT by WEMA</p>
        </div>
      ),
      enableSorting: false,
    },
    {
      header: "Date Created",
      accessorKey: "createdAt",
      enableSorting: false,
    },
    {
      header: "Date Updated",
      accessorKey: "updatedAt",
      enableSorting: false,
    },
    columnHelper.display({
      id: "actions",
      cell: ({ row }) => (
        <div
          className={styles.viewButton}
          onClick={() => selectVirtualAccount(row.original)}
        >
          <Eye />
          <span>View</span>
        </div>
      ),
      header: "Actions",
      enableSorting: false,
    }),
  ];

  // Post selection of VA
  const [showForm, setShowForm] = useState(false);
  const [currentTab, setCurrentTab] = useState("Split Rules");

  const tabs = [
    {
      title: "Split Rules",
      element: (
        <SplitRules
          virtualAccount={selectedVA}
          showForm={showForm}
          setShowForm={setShowForm}
        />
      ),
    },
    {
      title: "Transactions",
      element: <SettlementHistory virtualAccount={selectedVA} />,
    },
  ];

  return (
    <PageLayout
      title={`Virtual Account Split Settlement`}
      titleVariant="smaller"
      description=""
      actions={[
        <label className={styles.toggle}>
          {activationStatus ? "Deactivate Settlement" : "Activate Settlement"}
          <Toggle
            id={"activate_business_settlement"}
            checked={activationStatus}
            onChange={handleToggle}
          />
        </label>,
        <Button
          text={"Initiate Settlement"}
          onClick={handleInitiateSettlement}
          disabled={!activationStatus}
          isLoading={isInitiating}
        />,
      ]}
    >
      {activationStatus ? (
        <div className={styles.content}>
          <div
            className={isTabsPage ? styles.hidden : styles.accountsTableWrapper}
          >
            <Search onSearch={setSearchTerm} searchText={searchTerm} />
            {activationStatus ? (
              <Table
                data={filteredVirtualAccounts ?? []}
                columns={virtualAccountsColumn}
                useHeader={false}
                loading={isLoading}
                tableProps={{
                  isPaginated: "local",
                }}
              />
            ) : (
              <EmptyData
                iconSrc={empty}
                message="Activate Settlement Service for this Business to continue"
              />
            )}
          </div>

          <div className={isTabsPage ? "" : styles.hidden}>
            <PageLayout
              title="tabs"
              goBack={"Other Accounts"}
              goBackCb={() => unselectVirtualAccount()}
            >
              <TabSwitcher
                titles={tabs?.map((item) => item.title)}
                onTabChange={(title) => {
                  setCurrentTab(title);
                }}
              >
                {tabs?.map((item, i) => (
                  <TabPanel
                    selected={
                      item.title.toLowerCase() === currentTab?.toLowerCase()
                    }
                    key={i}
                  >
                    {item.element}
                  </TabPanel>
                ))}
              </TabSwitcher>
            </PageLayout>
          </div>
        </div>
      ) : (
        <EmptyData
          iconSrc={empty}
          message="Activate settlement service to continue."
        />
      )}
    </PageLayout>
  );
};

export default VirtualAccounts;
