import { FcBrokenLink } from "react-icons/fc";
import styles from "./styles.module.scss";
import {
  useGetBusinessProcessorsQuery,
  useToggleBusinessProcessorMutation,
} from "src/redux/features/admin/gatewaySlice";
import { useSelector } from "react-redux";
import { selectBusiness } from "src/redux/features/admin/util/businessSlice";
import { toast } from "react-toastify";
import { TbLoader3 } from "react-icons/tb";
import EmptyData from "components/Global/EmptyData";
import SuspenseElement from "components/Global/SuspenseElement";
import PermissionWrapper from "components/Global/PermissionWrapper";

const PaymentGateways = () => {
  const { highlightedBusiness } = useSelector(selectBusiness);
  const { data: processors, isLoading } = useGetBusinessProcessorsQuery(
    highlightedBusiness?.id as string,
    {
      skip: !highlightedBusiness,
    }
  );
  const [toggleProcessorStatus] = useToggleBusinessProcessorMutation();

  const toggleBusinessProcessorStatus = (
    processorID: string,
    newStatus: boolean
  ) => {
    if (!highlightedBusiness) return;

    toggleProcessorStatus({
      businessId: highlightedBusiness?.id as string,
      businessPaymentProcessorId: processorID,
      isActive: newStatus,
    })
      .unwrap()
      .then(() => {
        toast.success("Status updated sucessfully!");
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.data.message);
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.alertBar}></div>
      <div className={styles.list}>
        {!processors?.length && !isLoading ? (
          <EmptyData />
        ) : isLoading ? (
          <SuspenseElement />
        ) : (
          processors?.map((item, i) => {
            const status =
              item.status_id?.toLocaleLowerCase() === "active" ? true : false;

            return (
              <div key={i} className={styles.listRow}>
                <div className={styles.titleLogo}>
                  <div className={styles.logo}>
                    {item.payment_processor?.logo ? (
                      <div className={styles.imgContainer}>
                        <img
                          src={`data:image/png;base64, ${item.payment_processor?.logo}`}
                          alt="logo"
                        />
                      </div>
                    ) : (
                      <div className={styles.defaultLogo}>
                        <p>{item.payment_processor?.name?.slice(0, 1)}</p>
                      </div>
                    )}
                  </div>
                  <div className={styles.titleDesc}>
                    <p>{item.payment_processor?.name}</p>
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
                  <PermissionWrapper permission="business-payment-processor:edit">
                    <button
                      onClick={() =>
                        toggleBusinessProcessorStatus(item.id, !status)
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

export default PaymentGateways;
