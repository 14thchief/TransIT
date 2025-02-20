import { Checkmark } from "src/assets/icons/icons";
import styles from "./_styles.module.scss";

type ProgressBarProps = {
  progressSteps:
    | {
        title: string;
        info?: string;
        buttonText: string;
      }[]
    | string[];
  showStepTitle: boolean;
  className?: string;
  currentStepIndex: number;
  goTo: (value: number) => void;
  vertical?: boolean;
};

const ProgressBar = ({
  progressSteps,
  showStepTitle = true,
  currentStepIndex,
  goTo,
  vertical = false,
}: ProgressBarProps) => {
  return (
    <div className={vertical ? styles.vertical_bar : styles.horizontal_bar}>
      {progressSteps.map((step, index) => {
        const isActive = currentStepIndex >= index;

        return (
          <div
            className={
              isActive ? `${styles.active} ${styles.step}` : styles.step
            }
            key={index}
          >
            {showStepTitle && (
              <div className={styles.title}>
                <h4 className={isActive ? styles.current : ""}>
                  {typeof step === "object" ? step.title : step}
                </h4>
                {typeof step === "object" && step.info && (
                  <p className={isActive ? styles.current : ""}>{step.info}</p>
                )}
              </div>
            )}
            <div className={styles.bar}>
              <hr
                className={
                  currentStepIndex >= index ? styles.done : styles.not_done
                }
              />
              <button
                onClick={() => goTo(index)}
                disabled={currentStepIndex <= index}
              >
                {currentStepIndex > index ? (
                  <span className={styles.icon}>
                    <Checkmark />
                  </span>
                ) : (
                  index + 1
                )}
              </button>
              <hr
                className={
                  currentStepIndex > index ? styles.done : styles.not_done
                }
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProgressBar;
