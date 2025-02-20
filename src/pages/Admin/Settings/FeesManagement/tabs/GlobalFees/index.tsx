import PageLayout from "src/pages/Admin/_components/PageLayout";
import styles from "./styles.module.scss";
import Button from "components/Core/Button";
import Table from "components/Global/Table";
import { createColumnHelper } from "@tanstack/react-table";
import { TableColumn } from "components/Global/Table/types";
import { useDispatch, useSelector } from "react-redux";
import { selectEnvironment } from "src/redux/features/admin/util/environmentSlice";
import { useEffect, useState } from "react";
import {
  useCreateGlobalFeesMutation,
  useDeleteGlobalFeesMutation,
  useGetGlobalFeesQuery,
  useUpdateGlobalFeesMutation,
} from "src/redux/features/admin/feesMangementSlice";
import {
  FeeSetting,
  GlobalFeesPayload,
} from "src/redux/features/admin/types/feesManagementType";
import {
  highlightGlobalFee,
  selectGlobalFee,
} from "src/redux/features/admin/util/feeSettingsSlice";
import NotavailableText from "components/Global/NotAvailableText";
import { formatCurrency } from "src/utilities/formatCurrency";
import TableDropdownActions from "components/Global/Table/TableDropdownActions";
import { Add, Delete, Edit } from "src/assets/icons/icons";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import FormElement from "components/Core/FormElements/FormElement";
import { useGetAllProcessorsQuery } from "src/redux/features/admin/gatewaySlice";
import { PaymentProcessor } from "src/redux/features/admin/types/gatewayType";
import useGetCurrencies from "src/hooks/useGetCurrencies";
import { CgArrowLeft } from "react-icons/cg";
import { toast } from "react-toastify";
import { openActionModal } from "src/redux/features/util/actionModalSlice";
import { useSearchParams } from "react-router-dom";
import Toggle from "components/Global/Toggle";
import PermissionWrapper from "components/Global/PermissionWrapper";

const GlobalFees = () => {
  const methods = useForm({
    mode: "all",
  });
  const { handleSubmit, reset, resetField } = methods;

  // API COMMs SETUP
  const currencies = useGetCurrencies();
  const [createFeeSetting, { isLoading: isSubmitting }] =
    useCreateGlobalFeesMutation();
  const [updateFeeSetting, { isLoading: isUpdating }] =
    useUpdateGlobalFeesMutation();
  const [deleteFeeSetting] = useDeleteGlobalFeesMutation();
  const [searchParams, setSearchParams] = useSearchParams();

  // On component load
  useEffect(() => {
    setParams("action", "table");
    searchParams.delete("page");
    searchParams.delete("size");
  }, []);

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

  // EDIT MODE: Edit Data
  const editData = useSelector(selectGlobalFee);
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
      resetStateData();
    }
  }, [editData]);

  // Fee Type
  const [selectedFeeType, setSelectedFeeType] = useState<
    FeeSetting["fee_type"] | null | undefined
  >(editData?.fee_type);
  useEffect(() => {
    // Reset enableCap choice
    selectedFeeType === "flat" && setEnableCap(false);
  }, [selectedFeeType]);

  // Enable Capped Fee
  const [enableCap, setEnableCap] = useState(!!editData?.capped_amount);
  useEffect(() => {
    // if there is no editable data, reset capped amount whenever enableCap is turned off
    if (!enableCap && !editData) {
      resetField("cappedAmount", { defaultValue: "" });
    }
  }, [enableCap]);

  const handleToggleAmountCap = () => {
    setEnableCap((prev) => !prev);
  };

  // Processors
  const { data: processorsData } = useGetAllProcessorsQuery({
    pageNumber: 1,
    pageSize: 100,
  });

  // LOV
  const processors = processorsData?.paymentProcessors;

  const [selectedProcessor, setSelectedProcessor] = useState<
    PaymentProcessor | null | undefined
  >(editData?.payment_processor);
  useEffect(() => {
    // Clear Payment method input
    resetField("paymentMethodId");
  }, [selectedProcessor]);

  const dispatch = useDispatch();
  const { environment } = useSelector(selectEnvironment);
  const [pagination, setPagination] = useState({
    pageNumber: 1,
    pageSize: 10,
  });
  const queryOptions = {
    per_page: pagination.pageSize,
    page: pagination.pageNumber,
    environment,
  };

  // Data Rendering
  const { data, isLoading, isFetching } = useGetGlobalFeesQuery(queryOptions);
  const fees = data?.feeSettings;
  const totalCount = data?.feeSettingsCount;

  const columnHelper = createColumnHelper<FeeSetting>();

  const GlobalFeesColumn: TableColumn<FeeSetting>[] = [
    {
      header: "Fee Type",
      accessorKey: "fee_type",
      enableSorting: false,
    },
    {
      header: "Processor",
      accessorKey: "processor",
      accessorFn: (data) => data.payment_processor?.name,
      enableSorting: false,
    },
    {
      header: "Channel",
      accessorFn: (data) => data.payment_method.name,
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
                  dispatch(highlightGlobalFee(row.original));
                  setParams("action", "form");
                  // setShowForm(true);
                },
              },
              {
                label: "Delete Fee Setting",
                icon: <Delete />,
                onClick: () => {
                  dispatch(
                    openActionModal({
                      title: `Delete Fee seeting`,
                      type: "warning",
                      content:
                        "You are about to delete this Fee setting, this action is irreversible.",
                      isOpen: true,
                      cancelText: "Cancel",
                      callback: () => {
                        deleteFeeSetting({ environment, id: row.original.id })
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
      id: editData?.id,
      amount: parseInt(data?.amount),
      paymentProcessorId: editData ? null : data?.paymentProcessorId?.value,
      paymentMethodId: editData ? null : data?.paymentMethodId?.value,
      currency: data?.currency?.value,
      feeType: data?.fee_type?.value,
      cappedAmount:
        enableCap && data?.cappedAmount ? parseInt(data?.cappedAmount) : 0,
    };

    const formData: any = {};

    // Remove null values
    for (const key in fmtData) {
      if (fmtData[key] !== null) {
        formData[key] = fmtData[key];
      }
    }

    editData
      ? updateFeeSetting(formData as GlobalFeesPayload)
          .unwrap()
          .then((result) => {
            if (result.status) {
              resetStateData();
              setParams("action", "table");
              toast.success(result.message);
            }
          })
          .catch((err) => {
            console.error(err);
            toast.error(err.data?.message);
          })
      : createFeeSetting(formData as GlobalFeesPayload)
          .unwrap()
          .then((result) => {
            if (result.status) {
              resetStateData();
              setParams("action", "table");
              toast.success(result.message);
            }
          })
          .catch((err) => {
            console.error(err);
            toast.error(err.data?.message);
          });
  };

  // Absolute Data Reset function
  const resetStateData = () => {
    setSelectedFeeType(null);
    setSelectedProcessor(null);
    dispatch(highlightGlobalFee(null));
    setEnableCap(false);
    reset({
      paymentProcessorId: null,
      paymentMethodId: null,
      fee_type: null,
      amount: null,
      cappedAmount: null,
      currency: null,
    });
    // setShowForm(false);
  };

  return (
    <PageLayout title={``} description={""} goBack={editData ? true : false}>
      {!showForm ? (
        <>
          <PermissionWrapper permission="global-fee-management:create">
            <div className={styles.actions}>
              {
                <Button
                  text="Create New"
                  variant="main-reverse"
                  icon={<Add />}
                  onClick={() => {
                    resetStateData();
                    setParams("action", "form");
                  }}
                />
              }
            </div>
          </PermissionWrapper>

          <Table
            data={fees ?? []}
            columns={GlobalFeesColumn}
            useHeader={false}
            loading={isLoading || isFetching}
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
        <>
          <div
            onClick={() => {
              reset();
              dispatch(highlightGlobalFee(null));
              setParams("action", "table");
              // setShowForm(false);
            }}
            className={styles.goBack}
          >
            <CgArrowLeft size={18} />
            <p>Back</p>
          </div>
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
                      processors?.find((item) => item.id === value) || null
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
                    selectedProcessor?.payment_methods?.map((item) => ({
                      label: item.name,
                      value: item.id,
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
                    label: item.code,
                    value: item?.code,
                  })) || []
                }
                required
              />

              {/* <small className={styles.error}>{error}</small> */}
              <div className={styles.buttonContainer}>
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
        </>
      )}
    </PageLayout>
  );
};

export default GlobalFees;
