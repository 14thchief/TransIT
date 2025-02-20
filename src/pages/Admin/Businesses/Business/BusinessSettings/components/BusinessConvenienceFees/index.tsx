import styles from "./styles.module.scss";
import Button from "components/Core/Button";
import Table from "components/Global/Table";
import { createColumnHelper } from "@tanstack/react-table";
import { TableColumn } from "components/Global/Table/types";
import { useSelector } from "react-redux";
import { selectEnvironment } from "src/redux/features/admin/util/environmentSlice";
import { useEffect, useState } from "react";
import {
  useCreateConvenienceFeeMutation,
  useGetConvenienceFeesQuery,
  useUpdateConvenienceFeeMutation,
} from "src/redux/features/admin/feesMangementSlice";
import {
  ConvenienceFeesPayload,
  BusinessFeeSetting,
} from "src/redux/features/admin/types/feesManagementType";
import NotavailableText from "components/Global/NotAvailableText";
import { formatCurrency } from "src/utilities/formatCurrency";
import TableDropdownActions from "components/Global/Table/TableDropdownActions";
import { Add, Edit } from "src/assets/icons/icons";
import { FormProvider, useForm } from "react-hook-form";
import FormElement from "components/Core/FormElements/FormElement";
import useGetCurrencies from "src/hooks/useGetCurrencies";
import { toast } from "react-toastify";
import { selectBusiness } from "src/redux/features/admin/util/businessSlice";
import Toggle from "components/Global/Toggle";
import { useNavigate, useSearchParams } from "react-router-dom";
import { IoAddCircle, IoRemoveCircle } from "react-icons/io5";
import PageLayout from "src/pages/Admin/_components/PageLayout";
import PermissionWrapper from "components/Global/PermissionWrapper";

type formItem = {
  id: number;
  feeType?: string;
  amount?: number;
  cappedAmount?: number;
  enableCap: boolean;
  currency?: string;
};

const ConvenienceFees = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const methods = useForm({ mode: "all" });
  const { handleSubmit, reset } = methods;
  const currencies = useGetCurrencies();
  const [createFeeSetting, { isLoading: isSubmitting }] =
    useCreateConvenienceFeeMutation();
  const [updateFeeSetting, { isLoading: isUpdating }] =
    useUpdateConvenienceFeeMutation();

  const { highlightedBusiness } = useSelector(selectBusiness);
  const [highlightedFee, setHighlightedFee] = useState<any>(null);
  useEffect(() => {
    if (highlightedFee) {
      //Update submission array
      setFormItems([
        {
          id: 0,
          feeType: highlightedFee.fee_type,
          enableCap: highlightedFee.capped_amount > 0,
          amount: highlightedFee.amount,
          cappedAmount: highlightedFee.capped_amount ?? 0,
          currency: highlightedFee.currency,
        },
      ]);

      //Update form default values
      reset({
        feeType: {
          value: highlightedFee.fee_type,
          label: highlightedFee.fee_type,
        },
        amount: highlightedFee.amount?.toString(),
        cappedAmount: highlightedFee.capped_amount?.toString() ?? "0",
        currency: {
          value: highlightedFee.currency,
          label: highlightedFee.currency,
        },
      });
    } else {
      resetFormState();
      setFormItems([{ enableCap: false, id: 0 }]);
    }
  }, [highlightedFee]);

  const [formItems, setFormItems] = useState<formItem[]>([
    {
      id: 0,
      enableCap: false,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const setParams = (name: string, value: string) => {
    searchParams.set(name, value);
    setSearchParams(searchParams);
  };
  useEffect(() => {
    if (searchParams.get("action") === "form") {
      setShowForm(true);
    } else {
      setShowForm(false);
    }
  }, [searchParams]);
  const handleToggleAmountCap = (index: number) => {
    setFormItems((prev) => {
      prev[index].enableCap = !prev[index].enableCap;
      if (prev[index].enableCap === false) {
        prev[index].cappedAmount = 0;
      }

      return [...prev];
    });
  };

  const { environment } = useSelector(selectEnvironment);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
  });
  const queryOptions = {
    environment,
    businessId: highlightedBusiness?.id as string,
  };

  // Data Rendering
  const { data, isLoading, isFetching } = useGetConvenienceFeesQuery(
    queryOptions,
    {
      skip: !highlightedBusiness?.id,
    }
  );
  const fees = data?.fees;
  const totalCount = data?.feeCount;

  const columnHelper = createColumnHelper<BusinessFeeSetting>();

  const ConvenienceFeesColumn: TableColumn<BusinessFeeSetting>[] = [
    {
      header: "Fee Type",
      accessorKey: "fee_type",
      enableSorting: false,
    },
    {
      header: "Currency",
      accessorKey: "currency",
      cell: ({ getValue }) => getValue() ?? <NotavailableText />,
      enableSorting: false,
    },
    {
      header: "Fee Amount",
      accessorKey: "amount",
      cell: ({ row, getValue }) =>
        row.original.fee_type === "flat"
          ? formatCurrency(
              getValue() as number,
              row.original?.currency ?? undefined
            )
          : `${getValue() as number}%`,
      enableSorting: false,
    },
    {
      header: "Fee Cap",
      accessorKey: "cappped_amount",
      cell: ({ row }) =>
        formatCurrency(
          row.original.capped_amount,
          row.original?.currency ?? undefined
        ),
      enableSorting: false,
    },
    {
      header: "Date Created",
      accessorKey: "created_at",
      enableSorting: false,
    },
    {
      header: "Last Update",
      accessorKey: "updated_at",
      cell: ({ row }) => row.original.updated_at ?? <NotavailableText />,
      enableSorting: false,
    },
    columnHelper.display({
      id: "actions",
      cell: ({ row }) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <TableDropdownActions
            actions={[
              {
                label: "Edit Fee Setting",
                icon: <Edit />,
                onClick: () => {
                  setHighlightedFee(row.original);
                  setParams("action", "form");
                },
              },
            ]}
          />
        </div>
      ),
      header: "Actions",
      enableSorting: false,
    }),
  ];

  // Data Mutation
  const onSubmit = () => {
    let fmtData: any = {
      environment,
      businessId: highlightedBusiness?.id,
    };

    if (highlightedFee) {
      fmtData = {
        ...fmtData,
        ...formItems[0],
        convenienceFeeSettingId: highlightedFee?.id,
      };
    } else {
      fmtData = {
        ...fmtData,
        convenienceFees: formItems,
      };
    }

    const formData: any = {};

    for (const key in fmtData) {
      if (fmtData[key] !== null || fmtData[key] !== undefined) {
        formData[key] = fmtData[key];
      }
    }

    highlightedFee
      ? updateFeeSetting(formData)
          .unwrap()
          .then((result) => {
            if (result.status) {
              resetFormState();
              navigate(-1);
              // setParams("action", "table");
              toast.success(result.message);
              setHighlightedFee(null);
            }
          })
          .catch((err) => {
            console.error(err);
            toast.error(err.data?.message);
          })
      : createFeeSetting(formData as ConvenienceFeesPayload)
          .unwrap()
          .then((result) => {
            if (result.status) {
              resetFormState();
              navigate(-1);
              // setParams("action", "table");
              toast.success(result.message);
              setHighlightedFee(null);
            }
          })
          .catch((err) => {
            console.error(err);
            toast.error(err.data?.message);
          });
  };

  const resetFormState = () => {
    reset({
      fee_type: null,
      amount: null,
      cappedAmount: null,
      currency: null,
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

  const handleAddFormItem = (e: any) => {
    e.preventDefault();

    setFormItems((prev) => {
      return [
        ...prev,
        {
          enableCap: false,
          id: prev[prev?.length - 1] ? prev[prev?.length - 1].id + 1 : 0,
        },
      ];
    });
  };

  return (
    <div className={styles.container}>
      {!showForm ? (
        <PageLayout
          title="Convenience Fee Configuration"
          titleVariant="smaller"
          actions={[
            <PermissionWrapper permission="business-fee-settings:create">
              <Button
                text="Create New"
                icon={<Add />}
                onClick={() => {
                  resetFormState();
                  setHighlightedFee(null);
                  setParams("action", "form");
                }}
              />
            </PermissionWrapper>,
          ]}
        >
          <div className={styles.feeContainer}>
            <Table
              data={fees ?? []}
              columns={ConvenienceFeesColumn}
              useHeader={false}
              loading={isLoading || isFetching}
              tableProps={{
                isPaginated: "server",
                serverPagination: {
                  totalData: totalCount || 0,
                  pageIndex: pagination.pageNumber - 1,
                  pageSize: pagination.pageSize,
                  setPageIndex: (index) =>
                    setPagination((prev) => ({
                      ...prev,
                      pageNumber: index + 1,
                    })),
                  setPageSize: (size) =>
                    setPagination((prev) => ({ ...prev, pageSize: size })),
                },
              }}
            />
          </div>
        </PageLayout>
      ) : (
        <div className={styles.formContainer}>
          <FormProvider {...methods}>
            <form onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
              <div className={styles.formItemsContainer}>
                {formItems?.map((item, i) => {
                  return (
                    <div className={styles.formItem} key={i}>
                      {formItems?.length > 1 && i === formItems?.length - 1 && (
                        <button
                          type="button"
                          className={styles.remove}
                          onClick={(e) => handleRemoveForm(e, i)}
                        >
                          <IoRemoveCircle color="#d92d20" size={22} /> Remove
                        </button>
                      )}
                      <FormElement
                        type="select"
                        fieldName={`feeType${i > 0 ? i : ""}`}
                        fieldLabel="Fee Type"
                        placeholder="Select Rate Type"
                        // defaultValue={{label: highlightedFee?.fee_type, value: highlightedFee?.fee_type}}
                        optionsData={
                          ["flat", "percentage"]?.map((item) => ({
                            label: item,
                            value: item,
                          })) || []
                        }
                        onChangeFn={({ value }: any) =>
                          setFormItems((prev) => {
                            prev[i].feeType = value;

                            return [...prev];
                          })
                        }
                        required
                      />
                      {(item.feeType || highlightedFee?.fee_type) && (
                        <FormElement
                          type="number"
                          fieldName={`amount${i > 0 ? i : ""}`}
                          fieldLabel={
                            item.feeType === "percentage"
                              ? "Fee Percentage"
                              : "Fee Amount"
                          }
                          placeholder={`Enter ${
                            item.feeType === "percentage"
                              ? "Fee Percentage"
                              : "Fee Amount"
                          }`}
                          // defaultValue={highlightedFee?.amount}
                          validateFn={(value) => {
                            return +value < 1 ||
                              (item.feeType === "percentage" && +value > 100)
                              ? "Invalid value"
                              : true;
                          }}
                          isValidated
                          onChangeFn={(value) =>
                            setFormItems((prev) => {
                              prev[i].amount = parseInt(value as string);

                              return [...prev];
                            })
                          }
                          required
                        />
                      )}
                      {(item.feeType === "percentage" ||
                        highlightedFee?.fee_type === "percentage") && (
                        <label
                          className={`
                                                    ${styles.toggleLabel}
                                                `}
                        >
                          <Toggle
                            id={"enable_cap"}
                            checked={item.enableCap}
                            onChange={() => handleToggleAmountCap(i)}
                            offColor="#d3d3d3"
                            onColor="#01821D"
                          />
                          {item.enableCap
                            ? "Disable Fee Cap"
                            : "Enable Fee Cap"}
                        </label>
                      )}

                      {item.enableCap && (
                        <FormElement
                          type="number"
                          fieldName={`cappedAmount${i > 0 ? i : ""}`}
                          fieldLabel={"Amount Cap"}
                          placeholder={`Enter Fee Cap Amount`}
                          // defaultValue={highlightedFee?.capped_amount}
                          validateFn={(value) =>
                            value && +value < 1 ? "Invalid value" : true
                          }
                          isValidated
                          onChangeFn={(value) =>
                            setFormItems((prev) => {
                              prev[i].cappedAmount = parseInt(value as string);

                              return [...prev];
                            })
                          }
                          required
                        />
                      )}
                      <FormElement
                        type="select"
                        fieldName={`currency${i > 0 ? i : ""}`}
                        fieldLabel="Currency"
                        placeholder="Select Currency"
                        // defaultValue={{label: highlightedFee?.currency, value: highlightedFee?.currency}}
                        optionsData={
                          currencies?.map((item) => ({
                            label: item.name,
                            value: item?.code,
                          })) || []
                        }
                        onChangeFn={({ value }: any) =>
                          setFormItems((prev) => {
                            prev[i].currency = value;

                            return [...prev];
                          })
                        }
                        required
                      />
                    </div>
                  );
                })}
                {!highlightedFee && (
                  <div className={styles.formActions}>
                    <button
                      className={styles.add}
                      onClick={(e) => handleAddFormItem(e)}
                    >
                      <IoAddCircle color={"#158957"} size={22} />
                      Add Additional Fees
                    </button>
                  </div>
                )}
              </div>
              {/* <small className={styles.error}>{error}</small> */}
              <div className={styles.buttonContainer}>
                <Button
                  text={"Cancel"}
                  type="reset"
                  variant="main-reverse"
                  onClick={() => {
                    resetFormState();
                    navigate(-1);
                    setParams("action", "table");
                  }}
                />
                <Button
                  text={
                    isSubmitting
                      ? "Creating..."
                      : isUpdating
                      ? "Updating..."
                      : "Submit"
                  }
                  type="submit"
                  isLoading={isSubmitting}
                />
              </div>
            </form>
          </FormProvider>
        </div>
      )}
    </div>
  );
};

export default ConvenienceFees;
