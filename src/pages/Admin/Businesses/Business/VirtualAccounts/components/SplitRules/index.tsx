import styles from "./styles.module.scss";
import PageLayout from "src/pages/Admin/_components/PageLayout";
import Table from "components/Global/Table";
import { createColumnHelper } from "@tanstack/react-table";
import { TableColumn } from "components/Global/Table/types";
import { useDispatch, useSelector } from "react-redux";
import { selectEnvironment } from "src/redux/features/admin/util/environmentSlice";
import { useEffect, useState } from "react";
import { Delete, Edit } from "src/assets/icons/icons";
import { useSearchParams } from "react-router-dom";
import Button from "components/Core/Button";
import Modal from "components/Core/Modal";
import { FormProvider, useForm } from "react-hook-form";
import FormElement from "components/Core/FormElements/FormElement";
import { IoAddCircle, IoRemoveCircle } from "react-icons/io5";
// import { useGetAccountNameMutation } from "src/redux/features/bank/bankAccountSlice";
import {
  MutateSettlementAccountPayload,
  QuerySettlementAccountsPayload,
  VASettlementAccountItem,
  SettlementRulePayload,
  VASettlementAccountResponseData,
  VirtualAccountResponse,
} from "src/redux/features/admin/types/virtualAccountType";
import usePersistedBusiness from "src/hooks/usePersistentBusiness";
import {
  useCreateSettlementAccountMutation,
  useDeleteSettlementAccountMutation,
  useGetSettlementRuleQuery,
  useGetVASettlementAccountsQuery,
  useUpdateSettlementAccountMutation,
  useUpdateSettlementRuleMutation,
} from "src/redux/features/admin/virtualAccountSlice";
import { toast } from "react-toastify";
import { formatCurrency } from "src/utilities/formatCurrency";
import { openActionModal } from "src/redux/features/util/actionModalSlice";
import EmptyData from "components/Global/EmptyData";
import empty from "../../../../../../../assets/images/empty.png";

type FormItem = {
  id: number | string;
  bankCode?: string;
  splitValue?: number;
  splitType?: "FLAT" | "PERCENTAGE";
  accountNumber?: string;
  accountName?: string | null | false;
};

const SplitRules = ({
  showForm,
  setShowForm,
  virtualAccount,
}: {
  showForm: boolean;
  setShowForm: (status: boolean) => void;
  virtualAccount: VirtualAccountResponse["data"][0] | null;
}) => {
  const dispatch = useDispatch();
  const { business } = usePersistedBusiness();
  //   const { getBankName } = useBank();
  //   const [inquireAccountName] = useGetAccountNameMutation();

  const [searchParams, setSearchParams] = useSearchParams();
  const methods = useForm({ mode: "all" });
  const { handleSubmit, reset } = methods;
  const resetFormState = () => {
    reset(defaultFormState);
    setSelectedConfig(defaultFormState.settlementMethod);
    setShowCustomForm(false);
    setFormItems([
      {
        id: 0,
        accountName: null,
      },
    ]);
  };

  const { environment } = useSelector(selectEnvironment);
  const [pagination, setPagination] = useState({
    pageNumber: searchParams.get("page")
      ? parseInt(searchParams.get("page") as string)
      : 1,
    pageSize: searchParams.get("size")
      ? parseInt(searchParams.get("size") as string)
      : 10,
  });
  useEffect(() => {
    searchParams.set("page", `${pagination.pageNumber}`);
    searchParams.set("size", `${pagination.pageSize}`);
    setSearchParams(searchParams);
  }, [pagination]);

  const onSubmit = async () => {
    const fmtData: MutateSettlementAccountPayload = {
      businessUUID: business?.uuid,
      virtualAccountId: virtualAccount?.id,
      accountNumber: formItems[0]?.accountNumber,
      bankCode: formItems[0]?.bankCode,
      splitValue: formItems[0]?.splitValue ?? 100,
      splitType: formItems[0]?.splitType ?? "PERCENTAGE",
      settlementAccountId: formItems[0]?.id as string,
    };

    // Check if config was updated
    if (selectedConfig) {
      if (selectedConfig !== virtualAccountConfig?.settlementMethod) {
        await handleUpdateVAConfig(selectedConfig);
      }

      if (!showCustomForm) {
        resetFormState();
        setShowForm(false);
      }
    }

    // if a new account was added or an account updated
    if (
      fmtData.bankCode &&
      fmtData.accountNumber &&
      fmtData.splitType &&
      fmtData.splitValue &&
      selectedConfig === "CUSTOM"
    ) {
      editData
        ? await handleUpdateVASettlementAccount(fmtData)
        : await handleCreateVASettlementAccount(fmtData);
    }
  };

  const [editData, setEditData] =
    useState<VASettlementAccountResponseData["data"][0]>();
  useEffect(() => {
    if (editData) {
      setFormItems([
        {
          id: editData.id,
          splitType: editData.splitType,
          splitValue: editData.splitPercentage,
          accountName: editData.accountName,
          accountNumber: editData.accountNumber,
          bankCode: editData.bankCode,
        },
      ]);

      reset({
        settlementMethod: selectedConfig,
        splitType: {
          value: editData?.splitType,
          label: editData?.splitType,
        },
        splitValue: editData?.splitPercentage?.toString(),
        bankCode: editData?.bankCode,
        accountNumber: editData?.accountNumber,
      });

      selectedConfig === "CUSTOM"
        ? setShowCustomForm(true)
        : setShowCustomForm(false);
    }
  }, [editData]);

  const [formItems, setFormItems] = useState<FormItem[]>([
    {
      id: 0,
    },
  ]);

  const handleChange = (index: number, key: string, value: any) => {
    setFormItems((prev) => {
      (prev[index] as any)[key] = value;

      //   const condition1 = key === "bankCode" || key === "accountNumber";
      //   const condition2 =
      //     prev[index].bankCode &&
      //     prev[index].accountNumber &&
      //     (prev[index].accountNumber as string).length > 9;

      //   if (condition1) {
      //     if (condition2) {
      //       prev[index].accountName = "...."; // Loading indicator
      //       //   inquireAccountName({
      //       //     accountNumber: prev[index].accountNumber as string,
      //       //     bankCode: prev[index].bankCode as string,
      //       //   })
      //       //     .unwrap()
      //       //     .then((res) => {
      //       //       prev[index].accountName = res.name;
      //       //     })
      //       //     .catch((err) => {
      //       //       console.error({ errorRES: err });
      //       //       prev[index].accountName = false;
      //       //     });
      //     } else {
      //       prev[index].accountName = null;
      //     }
      //   }

      return [...prev];
    });
  };

  const handleRemoveForm = (e: any, i: number) => {
    e.preventDefault();

    setFormItems((prev) => {
      return prev.filter((item) => item.id !== i);
      // prev.pop();
      // return [...prev];
    });
  };

  const handleEditSplitFee = (rowData: any) => {
    setEditData(rowData);
    setShowForm(true);
  };

  const handleDeleteSplitFee = (rowData: VASettlementAccountItem) => {
    dispatch(
      openActionModal({
        isOpen: true,
        type: "warning",
        title: `Delete Settlement Split Rule`,
        content: `Are you sure you want to Delete this item? This action is irreversible.`,
        callback: () => {
          const toastId = toast.loading("Deleting Account...");
          deleteVASettlementAccount({
            id: rowData.id,
            environment,
            businessUUID: business?.uuid as string,
          })
            .unwrap()
            .then((res) => {
              toast.dismiss(toastId);
              toast.success(res.message);
            })
            .catch((err) => {
              toast.dismiss(toastId);
              console.error({ error: err });
            });
        },
        cancelText: "Cancel",
      })
    );
  };

  /* Data Manipulations */
  // const [selectedType, setSelectedType] = useState<MutateSettlementAccountPayload["splitType"] | "All">("All")

  // Get Current Config
  const { data: virtualAccountConfig } = useGetSettlementRuleQuery(
    {
      businessUUID: business?.uuid,
      virtualAccountId: virtualAccount?.id,
    },
    {
      skip: !business || !virtualAccount,
    }
  );

  // Config setting
  const [selectedConfig, setSelectedConfig] = useState<
    "DEFAULT" | "CUSTOM" | undefined
  >(virtualAccountConfig?.settlementMethod);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const defaultFormState = {
    splitType: null,
    splitValue: null,
    bankCode: null,
    accountNumber: null,
    settlementMethod: virtualAccountConfig?.settlementMethod,
  };

  // Functions to Update Config
  const [updateVirtualAccountConfig, { isLoading: isSubmittingConfig }] =
    useUpdateSettlementRuleMutation();
  useEffect(() => {
    if (virtualAccountConfig?.settlementMethod) {
      reset({
        ...defaultFormState,
        settlementMethod: virtualAccountConfig?.settlementMethod,
      });
      setSelectedConfig(virtualAccountConfig?.settlementMethod);
    }
  }, [virtualAccountConfig]);
  const handleUpdateVAConfig = async (
    method: SettlementRulePayload["settlementMethod"]
  ) => {
    try {
      const res = await updateVirtualAccountConfig({
        businessUUID: business?.uuid as string,
        virtualAccountId: virtualAccount?.id,
        settlementMethod: method,
      }).unwrap();

      if (res.status) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      return console.error({ error });
    }
  };

  // Create VA settlement Rule/Account
  const [createVASettlementAccount, { isLoading: isSubmittingSettlement }] =
    useCreateSettlementAccountMutation();
  const [updateVASettlementAccount, { isLoading: isUpdating }] =
    useUpdateSettlementAccountMutation();
  const [deleteVASettlementAccount] = useDeleteSettlementAccountMutation();
  const isSubmitting =
    isSubmittingConfig || isSubmittingSettlement || isUpdating;

  const handleCreateVASettlementAccount = async (
    data: MutateSettlementAccountPayload
  ) => {
    try {
      const res = await createVASettlementAccount(data).unwrap();
      if (res.status) {
        toast.success(res.message);
        setShowForm(false);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      return console.error({ error });
    }
  };
  const handleUpdateVASettlementAccount = async (
    data: MutateSettlementAccountPayload
  ) => {
    try {
      const res = await updateVASettlementAccount(data).unwrap();
      if (res.status) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }

      setShowForm(false);
    } catch (error) {
      return console.error({ error });
    }
  };

  // Get VA Settlement Rules/Accounts
  const query: QuerySettlementAccountsPayload = {
    environment,
    per_page: pagination.pageSize,
    page: pagination.pageNumber,
    businessUUID: business?.uuid,
    virtualAccountId: virtualAccount?.id,
  };
  const { data, isLoading } = useGetVASettlementAccountsQuery(query, {
    skip: !business?.uuid || !virtualAccount,
  });
  // const { data: altData } = useGetVASettlementHistoryQuery(query, {
  // 	skip: !business?.uuid || !virtualAccount
  // })
  // console.log({altData})
  const settlementAccounts = data?.data;
  const totalCount = data?.count;

  const columnHelper = createColumnHelper<VASettlementAccountItem>();

  const SplitRulesColumn: TableColumn<VASettlementAccountItem>[] = [
    {
      header: "Account Name",
      accessorKey: "accountName",
      enableSorting: false,
    },
    {
      header: "Account Number",
      accessorKey: "accountNumber",
      enableSorting: false,
    },
    {
      header: "Bank",
      accessorFn: (rowData) => rowData.bankCode,
      enableSorting: false,
    },
    {
      header: "Split Type",
      accessorKey: "splitType",
      enableSorting: false,
    },
    {
      header: "Split Amount",
      accessorFn: (rowData) =>
        `${
          rowData.splitType === "FLAT"
            ? formatCurrency(rowData.splitPercentage, rowData.currency)
            : `${rowData.splitPercentage}%`
        }`,
      enableSorting: false,
    },
    {
      header: "Date Created",
      accessorKey: "createdAt",
      enableSorting: false,
    },
    {
      header: "Last Update",
      accessorKey: "updatedAt",
      enableSorting: false,
    },
    columnHelper.display({
      id: "actions",
      cell: ({ row }) => (
        <div className={styles.tableActions}>
          <Button
            variant="text"
            icon={<Edit />}
            onClick={() => handleEditSplitFee(row.original)}
          />
          <Button
            variant="text"
            icon={<Delete color="red" size={18} />}
            onClick={() => handleDeleteSplitFee(row.original)}
          />
        </div>
      ),
      header: "Actions",
      enableSorting: false,
    }),
  ];

  return (
    <PageLayout
      title={``}
      description={""}
      // goBack={false}
    >
      {virtualAccount ? (
        <>
          <div className={styles.action}>
            {/* <SelectFilter 
                        title="Type"
                        value={selectedType as string}
                        options={["All", "Flat", "Percentage"]}
                        onSelect={(value: any)=> setSelectedType(value)}
                    /> */}
            <Button
              text={"Add New Rule"}
              onClick={() => {
                resetFormState();
                setEditData(undefined);
                setShowForm(true);
              }}
            />
          </div>
          <Table
            data={settlementAccounts ?? []}
            columns={SplitRulesColumn}
            useHeader={false}
            loading={isLoading}
            tableProps={{
              isPaginated: "server",
              serverPagination: {
                totalData: totalCount || 0,
                pageIndex: pagination.pageNumber - 1,
                pageSize: pagination.pageSize,
                setPageIndex: (index) =>
                  setPagination((prev) => ({ ...prev, pageNumber: index + 1 })),
                setPageSize: (size) =>
                  setPagination((prev) => ({ ...prev, pageSize: size })),
              },
            }}
          />
        </>
      ) : (
        <EmptyData
          iconSrc={empty}
          message="Select a virtual account to  see the settlement split"
        />
      )}

      <Modal
        open={showForm}
        onClose={() => {
          setEditData(undefined);
          setShowForm(false);
        }}
      >
        <div className={styles.formContainer}>
          <FormProvider {...methods}>
            <form onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
              <section className={styles.config}>
                <FormElement
                  type="radio-options"
                  fieldName="settlementMethod"
                  fieldLabel="Select Rule"
                  // defaultValue={selectedConfig}
                  radioOptions={["DEFAULT", "CUSTOM"]}
                  onChangeFn={(value: any) => setSelectedConfig(value)}
                  required
                />
              </section>

              {selectedConfig === "CUSTOM" && showCustomForm && (
                <section className={styles.formItemsContainer}>
                  {formItems?.map((item, i) => {
                    return (
                      <div className={styles.formItem}>
                        {formItems?.length > 1 &&
                          i === formItems?.length - 1 && (
                            <button
                              type="button"
                              className={styles.remove}
                              onClick={(e) => handleRemoveForm(e, i)}
                            >
                              <IoRemoveCircle color="#d92d20" size={22} />{" "}
                              Remove
                            </button>
                          )}
                        {!!totalCount && totalCount > 0 && (
                          <>
                            <FormElement
                              type="select"
                              fieldName={`splitType${i > 0 ? i : ""}`}
                              fieldLabel="Split Type"
                              placeholder="Select Split Type"
                              // defaultValue={{label: editData?.splitType, value: editData?.splitType}}
                              optionsData={
                                ["FLAT", "PERCENTAGE"]?.map((item) => ({
                                  label: item,
                                  value: item,
                                })) || []
                              }
                              onChangeFn={({ value }: any) =>
                                handleChange(i, "splitType", value)
                              }
                              required
                            />
                            <FormElement
                              type="number"
                              fieldName={`splitValue${i > 0 ? i : ""}`}
                              fieldLabel={
                                item.splitType?.toLowerCase() === "percentage"
                                  ? "Split Percentage"
                                  : "Split Amount"
                              }
                              placeholder={`Enter ${
                                item.splitType?.toLowerCase() === "percentage"
                                  ? "Split Percentage"
                                  : "Split Amount"
                              }`}
                              // defaultValue={editData?.amount}
                              validateFn={(value) =>
                                +value < 1 ||
                                (item.splitType === "PERCENTAGE" &&
                                  +value > 100)
                                  ? "Invalid value"
                                  : true
                              }
                              isValidated
                              onChangeFn={(value: any) =>
                                handleChange(i, "splitValue", parseFloat(value))
                              }
                              required
                            />
                          </>
                        )}

                        <FormElement
                          type="text"
                          fieldName={`bankCode${i > 0 ? i : ""}`}
                          fieldLabel="Bank Code"
                          placeholder="Enter 6 digit bank code"
                          validateFn={(value) =>
                            (value as string)?.length < 6
                              ? "Please ensure bank code is 6 digits"
                              : true
                          }
                          isValidated
                          onChangeFn={(value: any) =>
                            handleChange(i, "bankCode", value)
                          }
                          required
                        />
                        {/* <FormElement
                          type="select"
                          fieldName={`bankCode${i > 0 ? i : ""}`}
                          fieldLabel="Bank"
                          placeholder="Select Bank"
                          // defaultValue={{label: editData?.splitType, value: editData?.splitType}}
                          optionsData={
                            banks?.map((item) => ({
                              label: item.name,
                              value: item.code,
                            })) || []
                          }
                          onChangeFn={({ value }: any) =>
                            handleChange(i, "bankCode", value)
                          }
                          required
                        /> */}
                        <FormElement
                          type="text"
                          fieldName={`accountNumber${i > 0 ? i : ""}`}
                          fieldLabel={"Account Number"}
                          placeholder={`Enter Account Name`}
                          onChangeFn={(value: any) =>
                            handleChange(i, "accountNumber", value)
                          }
                          required
                        />
                        {item.accountName !== null && (
                          <p
                            className={`${styles.accountName} ${
                              item.accountName === false
                                ? styles.error
                                : styles.success
                            }`}
                          >
                            {item.accountName === false
                              ? "Account not Found"
                              : item.accountName}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </section>
              )}

              {selectedConfig === "CUSTOM" && !showCustomForm && (
                <button
                  className={`${styles.button} ${styles.add}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setShowCustomForm(true);
                  }}
                >
                  Add Settlement Account
                  <IoAddCircle color={"#158957"} size={22} />
                </button>
              )}

              <div className={styles.buttonContainer}>
                <Button
                  text={"Cancel"}
                  type="reset"
                  variant="main-reverse"
                  onClick={() => {
                    resetFormState();
                    setEditData(undefined);
                    setShowForm(false);
                  }}
                />
                <Button
                  text={isSubmitting ? "Saving..." : "Save"}
                  type="submit"
                  isLoading={isSubmitting}
                />
              </div>
            </form>
          </FormProvider>
        </div>
      </Modal>
    </PageLayout>
  );
};

export default SplitRules;
