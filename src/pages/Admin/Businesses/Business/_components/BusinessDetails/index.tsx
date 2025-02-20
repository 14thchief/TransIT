import { CiCamera } from "react-icons/ci";
import styles from "./styles.module.scss";
import StatusBadge from "components/Global/StatusBadge";
import { Status } from "components/Global/StatusBadge/types";
import usePersistedBusiness from "src/hooks/usePersistentBusiness";
import PermissionWrapper from "components/Global/PermissionWrapper";

const BusinessDetails = () => {
  const { business: highlightedBusiness } = usePersistedBusiness();

  return (
    <div className={styles.businessDetails}>
      <div className={styles.card}>
        <div className={styles.img}>
          <CiCamera />
        </div>
        <div className={styles.content}>
          <div className={styles.titleAndDesc}>
            <h4>{highlightedBusiness?.name}</h4>
            <p>{"Registered Business"}</p>
          </div>

          <PermissionWrapper permission="business-status:read">
            <StatusBadge status={highlightedBusiness?.status_id as Status}>
              {highlightedBusiness?.status_id}
            </StatusBadge>
          </PermissionWrapper>
        </div>
      </div>
      <div className={styles.content}>
        <div className={`${styles.titleAndDesc}`}>
          <p>{"Business Owner"}</p>
          <h4>{highlightedBusiness?.name}</h4>
        </div>
      </div>
      <div className={styles.content}>
        <div className={`${styles.titleAndDesc}`}>
          <p>{"Email Address"}</p>
          <h4>{highlightedBusiness?.email}</h4>
        </div>
      </div>
      {/* <div className={styles.content}>
                <div className={`${styles.titleAndDesc}`}>
                    <p>{"Phone Number"}</p>
                    <h4>{highlightedBusiness?.phone_number}</h4>
                </div>
            </div> */}
    </div>
  );
};

export default BusinessDetails;
