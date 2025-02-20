import styles from "./styles.module.scss";
import Button from "components/Core/Button";
import Table from "components/Global/Table";
import { createColumnHelper } from "@tanstack/react-table";
import { TableColumn } from "components/Global/Table/types";
import { useDispatch, useSelector } from "react-redux";
import { selectEnvironment } from "src/redux/features/admin/util/environmentSlice";
import { useEffect, useState } from "react";
import {
  useCreateBusinessCustomFeesMutation,
  useDeleteBusinessCustomFeesMutation,
  useGetBusinessCustomFeesQuery,
  useUpdateBusinessCustomFeesMutation,
} from "src/redux/features/admin/feesMangementSlice";
import {
  FeeSetting,
  BusinessCustomFeesPayload,
  BusinessFeeSetting,
} from "src/redux/features/admin/types/feesManagementType";
import {
  highlightCustomFee,
  highlightGlobalFee,
  selectBusinessCustomFee,
} from "src/redux/features/admin/util/feeSettingsSlice";
import NotavailableText from "components/Global/NotAvailableText";
import { formatCurrency } from "src/utilities/formatCurrency";
import TableDropdownActions from "components/Global/Table/TableDropdownActions";
import { Add, Delete, Edit } from "src/assets/icons/icons";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import FormElement from "components/Core/FormElements/FormElement";
import {
  useGetBusinessPaymentMethodsQuery,
  useGetBusinessProcessorsQuery,
} from "src/redux/features/admin/gatewaySlice";
import useGetCurrencies from "src/hooks/useGetCurrencies";
import { toast } from "react-toastify";
import { openActionModal } from "src/redux/features/util/actionModalSlice";
import { selectBusiness } from "src/redux/features/admin/util/businessSlice";
import Toggle from "components/Global/Toggle";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageLayout from "src/pages/Admin/_components/PageLayout";
import PermissionWrapper from "components/Global/PermissionWrapper";
import { hasPermission } from "src/utilities/permissionBasedAccess";
import useSessionUserRole from "src/hooks/useSessionUserRole";

const BusinessCustomFees = () => {
  const { permissions } = useSessionUserRole({
    searchPermission: "business",
  });
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const methods = useForm({ mode: "all" });
  const { handleSubmit, reset, resetField } = methods;
  const currencies = useGetCurrencies();
  const [createFeeSetting, { isLoading: isSubmitting }] =
    useCreateBusinessCustomFeesMutation();
  const [updateFeeSetting, { isLoading: isUpdating }] =
    useUpdateBusinessCustomFeesMutation();
  const [deleteFeeSetting] = useDeleteBusinessCustomFeesMutation();
  const { highlightedBusiness } = useSelector(selectBusiness);

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
  const handleToggleAmountCap = () => {
    setEnableCap((prev) => !prev);
  };

  const editData = useSelector(selectBusinessCustomFee);
  useEffect(() => {
    if (editData) {
      setSelectedFeeType(editData?.fee_type);
      setSelectedProcessor(editData?.payment_processor);
      editData?.capped_amount ? setEnableCap(true) : setEnableCap(false);

      reset({
        paymentProcessorId: editData?.payment_processor?.id,
        paymentMethodId: {
          value: editData?.payment_method?.id,
          label: editData?.payment_method?.id,
        },
        fee_type: {
          value: editData?.fee_type,
          label: editData?.fee_type,
        },
        amount: editData?.amount?.toString(),
        cappedAmount: editData?.capped_amount?.toString(),
        currency: {
          value: editData?.currency,
          label: editData?.currency,
        },
      });
    } else {
      setSelectedFeeType(null);
      setSelectedProcessor(null);
      resetFormState();
    }
  }, [editData]);

  // Fee Type
  const [selectedFeeType, setSelectedFeeType] = useState<
    FeeSetting["fee_type"] | null | undefined
  >(editData?.fee_type);
  useEffect(() => {
    // Reset enableCap choice
    setEnableCap(false);
  }, [selectedFeeType]);

  // Enable Capped Fee
  const [enableCap, setEnableCap] = useState(!!editData?.capped_amount);
  useEffect(() => {
    // if there is no editable data, reset capped amount whenever enableCap is turned off
    if (!enableCap && !editData) {
      resetField("cappedAmount", { defaultValue: "" });
    }
  }, [enableCap]);

  // Processors and Payment methods
  const { data: rawProcessors } = useGetBusinessProcessorsQuery(
    highlightedBusiness?.id as string,
    {
      skip: !highlightedBusiness?.id,
    }
  );
  const processors = rawProcessors?.map((item) => item.payment_processor);
  const { data: paymentMethods } = useGetBusinessPaymentMethodsQuery(
    highlightedBusiness?.id as string,
    {
      skip: !highlightedBusiness?.id,
    }
  );

  const [selectedProcessor, setSelectedProcessor] = useState<
    FeeSetting["payment_processor"] | null | undefined
  >(editData?.payment_processor);
  useEffect(() => {
    // Clear Payment method input
    resetField("paymentMethodId", { defaultValue: "" });
  }, [selectedProcessor]);
  const getProcessorMethods = (processorID: string) => {
    return (
      paymentMethods?.filter(
        (item) => item.payment_processor_id === processorID
      ) || []
    );
  };

  const dispatch = useDispatch();
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
  const { data, isLoading, isFetching } = useGetBusinessCustomFeesQuery(
    queryOptions,
    {
      skip: !highlightedBusiness?.id,
    }
  );
  const fees = data?.fees;
  const totalCount = data?.feeCount;

  const columnHelper = createColumnHelper<BusinessFeeSetting>();

  const BusinessCustomFeesColumn: TableColumn<BusinessFeeSetting>[] = [
    {
      header: "Fee Type",
      accessorKey: "fee_type",
      enableSorting: false,
    },
    {
      header: "Processor",
      accessorKey: "processor",
      cell: ({ row }) => row.original.payment_processor?.name,
      enableSorting: false,
    },
    {
      header: "Channel",
      accessorKey: "method",
      cell: ({ row }) => row.original.payment_method?.name,
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
                  if (hasPermission(permissions, "business-fee-config:edit")) {
                    dispatch(highlightCustomFee(row.original));
                    setParams("action", "form");
                  } else {
                    toast.error(
                      "You do not have the permission to edit this fee."
                    );
                  }
                },
              },
              {
                label: "Delete Fee Setting",
                icon: <Delete />,
                onClick: () => {
                  if (
                    hasPermission(permissions, "business-fee-config:delete")
                  ) {
                    dispatch(
                      openActionModal({
                        title: `Delete Fee seeting`,
                        type: "warning",
                        content:
                          "You are about to delete this Fee setting, this action is irreversible.",
                        isOpen: true,
                        cancelText: "Cancel",
                        callback: () => {
                          deleteFeeSetting({
                            environment,
                            id: row.original.id,
                            businessID: highlightedBusiness?.uuid as string,
                          })
                            .unwrap()
                            .then((result) => {
                              if (result.status) {
                                toast.success(result.message);
                              }
                            })
                            .catch((err) => {
                              console.error(err);
                              toast.error(err.data?.message);
                            });
                        },
                      })
                    );
                  } else {
                    toast.error(
                      "You do not have the permission to delete this fee."
                    );
                  }
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
  const onSubmit = (data: FieldValues) => {
    const fmtData: any = {
      environment,
      businessId: highlightedBusiness?.id,
      feeSettingsId: editData?.id,
      amount: parseFloat(data?.amount),
      paymentProcessorId: editData
        ? editData?.payment_processor_id
        : data?.paymentProcessorId?.value,
      paymentMethodId: editData
        ? editData?.payment_method_id
        : data?.paymentMethodId?.value,
      currency: data?.currency?.value,
      feeType: data?.fee_type?.value,
      cappedAmount:
        enableCap && data?.cappedAmount ? parseFloat(data?.cappedAmount) : null,
    };

    const formData: any = {};

    for (const key in fmtData) {
      if (fmtData[key]) {
        formData[key] = fmtData[key];
      }
    }

    editData
      ? updateFeeSetting(formData)
          .unwrap()
          .then((result) => {
            if (result.status) {
              resetFormState();
              navigate(-1);
              setParams("action", "table");
              toast.success(result.message);
              dispatch(highlightGlobalFee(null));
              setSelectedFeeType(null);
              setSelectedProcessor(null);
            }
          })
          .catch((err) => {
            console.error(err);
            toast.error(err.data?.message);
          })
      : createFeeSetting(formData as BusinessCustomFeesPayload)
          .unwrap()
          .then((result) => {
            if (result.status) {
              resetFormState();
              navigate(-1);
              setParams("action", "table");
              toast.success(result.message);
              setSelectedFeeType(null);
              setSelectedProcessor(null);
            }
          })
          .catch((err) => {
            console.error(err);
            toast.error(err.data?.message);
          });
  };

  const resetFormState = () => {
    reset({
      paymentProcessorId: null,
      paymentMethodId: null,
      fee_type: null,
      amount: null,
      cappedAmount: null,
      currency: null,
    });
  };

  return (
    <div className={styles.container}>
      {!showForm ? (
        <PageLayout
          title="Custom Fee Configuration"
          titleVariant="smaller"
          actions={[
            <PermissionWrapper permission="business-fee-settings:create">
              <Button
                text="Create New"
                icon={<Add />}
                onClick={() => {
                  resetFormState();
                  dispatch(highlightCustomFee(null));
                  setSelectedFeeType(null);
                  setSelectedProcessor(null);
                  setParams("action", "form");
                }}
              />
            </PermissionWrapper>,
          ]}
        >
          <div className={styles.feeContainer}>
            <Table
              data={fees ?? []}
              columns={BusinessCustomFeesColumn}
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
              {!editData && (
                <FormElement
                  type="select"
                  fieldName="paymentProcessorId"
                  fieldLabel="Payment Processor"
                  placeholder="Select Processor"
                  // defaultValue={{label: editData?.payment_processor?.name, value: editData?.payment_processor?.id}}
                  optionsData={
                    processors?.map((item) => ({
                      label: item.name,
                      value: item.id,
                    })) || []
                  }
                  onChangeFn={({ value }: any) =>
                    processors &&
                    setSelectedProcessor(
                      (processors?.find((item) => item.id === value) as any) ||
                        null
                    )
                  }
                  required
                  isDisabled={!!editData}
                />
              )}
              {selectedProcessor && !editData && (
                <FormElement
                  type="select"
                  fieldName="paymentMethodId"
                  fieldLabel="Payment Method"
                  placeholder="Select Method"
                  // defaultValue={{label: editData?.payment_method?.name, value: editData?.payment_method_id}}
                  optionsData={
                    getProcessorMethods(selectedProcessor?.id)?.map((item) => ({
                      label: item.payment_method?.name,
                      value: item.payment_method?.id,
                    })) || []
                  }
                  required
                  isDisabled={!!editData}
                />
              )}
              <FormElement
                type="select"
                fieldName="fee_type"
                fieldLabel="Fee Type"
                placeholder="Select Rate Type"
                // defaultValue={{label: editData?.fee_type, value: editData?.fee_type}}
                optionsData={
                  ["flat", "percentage"]?.map((item) => ({
                    label: item,
                    value: item,
                  })) || []
                }
                onChangeFn={({ value }: any) => setSelectedFeeType(value)}
                required
              />
              {(selectedFeeType || editData?.fee_type) && (
                <FormElement
                  type="number"
                  fieldName="amount"
                  fieldLabel={
                    selectedFeeType === "percentage"
                      ? "Fee Percentage"
                      : "Fee Amount"
                  }
                  placeholder={`Enter ${
                    selectedFeeType === "percentage"
                      ? "Fee Percentage"
                      : "Fee Amount"
                  }`}
                  // defaultValue={editData?.amount}
                  validateFn={(value) =>
                    +value < 1 ||
                    (selectedFeeType === "percentage" && +value > 100)
                      ? "Invalid value"
                      : true
                  }
                  isValidated
                  required
                />
              )}
              {(selectedFeeType === "percentage" ||
                editData?.fee_type === "percentage") && (
                <label
                  className={`
                                    ${styles.toggleLabel}
                                    ${
                                      environment === "live"
                                        ? styles.green
                                        : styles.red
                                    }
                                `}
                >
                  <Toggle
                    id={"enable_cap"}
                    checked={enableCap}
                    onChange={() => handleToggleAmountCap()}
                    offColor="#d3d3d3"
                    onColor="#01821D"
                  />
                  {enableCap ? "Disable Fee Cap" : "Enable Fee Cap"}
                </label>
              )}

              {enableCap && (
                <FormElement
                  type="number"
                  fieldName="cappedAmount"
                  fieldLabel={"Amount Cap"}
                  placeholder={`Enter Fee Cap Amount`}
                  // defaultValue={editData?.capped_amount}
                  validateFn={(value) =>
                    value && +value < 1 ? "Invalid value" : true
                  }
                  isValidated
                  required
                />
              )}
              <FormElement
                type="select"
                fieldName="currency"
                fieldLabel="Currency"
                placeholder="Select Currency"
                // defaultValue={{label: editData?.currency, value: editData?.currency}}
                optionsData={
                  currencies?.map((item) => ({
                    label: item.name,
                    value: item?.code,
                  })) || []
                }
                required
              />

              {/* <small className={styles.error}>{error}</small> */}
              <div className={styles.buttonContainer}>
                <Button
                  text={"Cancel"}
                  type="reset"
                  variant="main-reverse"
                  onClick={() => {
                    resetFormState();
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

export default BusinessCustomFees;
