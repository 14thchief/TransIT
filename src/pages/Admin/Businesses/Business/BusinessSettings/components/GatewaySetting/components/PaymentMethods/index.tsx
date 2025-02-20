import { FcBrokenLink } from "react-icons/fc";
import styles from "./styles.module.scss";
import {
  useGetBusinessPaymentMethodsQuery,
  useToggleBusinessPaymentMethodMutation,
} from "src/redux/features/admin/gatewaySlice";
import { useSelector } from "react-redux";
import { selectBusiness } from "src/redux/features/admin/util/businessSlice";
import { toast } from "react-toastify";
import { TbLoader3 } from "react-icons/tb";
import EmptyData from "components/Global/EmptyData";
import SuspenseElement from "components/Global/SuspenseElement";
import PermissionWrapper from "components/Global/PermissionWrapper";

const PaymentMethods = () => {
  const { highlightedBusiness } = useSelector(selectBusiness);
  const { data: methods, isLoading } = useGetBusinessPaymentMethodsQuery(
    highlightedBusiness?.id as string,
    {
      skip: !highlightedBusiness,
    }
  );

  const [toggleMethodStatus] = useToggleBusinessPaymentMethodMutation();

  const toggleBusinessPaymentMethodStatus = (
    methodID: string,
    newStatus: boolean
  ) => {
    if (!highlightedBusiness) return;

    toggleMethodStatus({
      businessId: highlightedBusiness?.id as string,
      businessPaymentMethodId: methodID,
      isActive: newStatus,
    })
      .unwrap()
      .then(() => {
        toast.success("Status updated successfully!");
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.data.message);
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        {!methods?.length && !isLoading ? (
          <EmptyData />
        ) : isLoading ? (
          <SuspenseElement />
        ) : (
          methods?.map((item, i) => {
            const status =
              item.status_id?.toLocaleLowerCase() === "active" ? true : false;

            return (
              <div key={i} className={styles.listRow}>
                <div className={styles.titleLogo}>
                  <div className={styles.logo}>
                    {item.payment_method?.logo ? (
                      <div className={styles.imgContainer}>
                        <img
                          src={`data:image/png;base64, ${item.payment_method?.logo}`}
                          alt="logo"
                        />
                      </div>
                    ) : (
                      <div className={styles.defaultLogo}>
                        <p>{item.payment_method?.name?.slice(0, 1)}</p>
                      </div>
                    )}
                  </div>
                  <div className={styles.titleDesc}>
                    <p>{item.payment_method?.name}</p>
                  </div>
                </div>
                <div className={styles.statusAction}>
                  <p
                    className={`${styles.status} ${
                      status ? styles.online : styles.offline
                    }`}
                  >
                    {item.status_id}
                  </p>
                  <PermissionWrapper permission="business-payment-method:edit">
                    <button
                      onClick={() =>
                        toggleBusinessPaymentMethodStatus(item.id, !status)
                      }
                      className={styles.action}
                    >
                      {status ? (
                        <FcBrokenLink size={19} color={"$color-grey-text"} />
                      ) : (
                        <TbLoader3 size={19} />
                      )}
                      <p>{status ? "Disconnect" : "Connect"}</p>
                    </button>
                  </PermissionWrapper>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PaymentMethods;
