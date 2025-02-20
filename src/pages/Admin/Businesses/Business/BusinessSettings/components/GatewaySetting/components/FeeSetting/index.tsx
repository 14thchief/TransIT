import styles from "./styles.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { selectBusiness } from "src/redux/features/admin/util/businessSlice";
// import { toast } from "react-toastify";
import {
  useGetBusinessFeeSettingsQuery,
  useUpdateBusinessFeeSettingsMutation,
} from "src/redux/features/admin/gatewaySlice";
import { selectEnvironment } from "src/redux/features/admin/util/environmentSlice";
import { openActionModal } from "src/redux/features/util/actionModalSlice";
import { hasPermission } from "src/utilities/permissionBasedAccess";
import useSessionUserRole from "src/hooks/useSessionUserRole";
import { toast } from "react-toastify";

const FeeSetting = () => {
  const { permissions } = useSessionUserRole({
    searchPermission: "business",
  });
  const dispatch = useDispatch();
  const { highlightedBusiness } = useSelector(selectBusiness);
  const { environment } = useSelector(selectEnvironment);
  const { data: feeSetting } = useGetBusinessFeeSettingsQuery(
    {
      businessID: highlightedBusiness?.uuid as string,
      environment,
    },
    {
      skip: !highlightedBusiness,
    }
  );

  const feeBearer = feeSetting?.default_fee_setting?.fee_bearer;

  const [updateSetting] = useUpdateBusinessFeeSettingsMutation();

  const handleUpdateSetting = (feeBearer: string) => {
    if (!hasPermission(permissions, "business-fee-config:edit")) {
      return toast.error(
        "You do not have the permission to update fee settings."
      );
    }
    if (!highlightedBusiness?.uuid || !feeBearer) {
      return;
    }

    const fmtData = {
      uuid: highlightedBusiness?.uuid,
      environment: environment,
      bearer: feeBearer,
    };

    dispatch(
      openActionModal({
        isOpen: true,
        title: "Switch Fee Bearer",
        content: `Are you sure you want the ${feeBearer} to be the Fee bearer?`,
        type: "warning",
        cancelText: "No, Cancel",
        callback: () => {
          updateSetting(fmtData).catch((error) => {
            console.error({ error });
          });
        },
      })
    );
  };

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>Transaction Fees</h4>
      <div>
        <small>Fees charged by SoftGATE for processing your payments</small>
        <div className={styles.cards}>
          <label>
            <input
              type="radio"
              name="fee-bearer"
              checked={feeBearer === "customer"}
              onChange={() => {
                handleUpdateSetting("customer");
              }}
            />
            Customer bears fees
          </label>
          <label>
            <input
              type="radio"
              name="fee-bearer"
              checked={feeBearer === "business"}
              onChange={() => {
                handleUpdateSetting("business");
              }}
            />
            Business bears fees
          </label>
        </div>
      </div>
    </div>
  );
};

export default FeeSetting;
