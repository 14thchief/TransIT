import FormElement from "components/Core/FormElements/FormElement";
import styles from "./_styles.module.scss";
import { validateEmail } from "src/constants/validations";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import Button from "components/Core/Button";
import { Link } from "react-router-dom";
import { useSendResetLinkMutation } from "src/redux/features/auth/loginSlice";
import { SigninPayload } from "src/redux/features/auth/types/loginType";
// import usePersistentAuth from "src/hooks/usePersistentAuth";
import { useDispatch } from "react-redux";
import { openActionModal } from "src/redux/features/util/actionModalSlice";
import { useEffect, useState } from "react";

const ForgotPassword = () => {
  const methods = useForm({ mode: "all" });
  const { handleSubmit } = methods;
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  useEffect(() => {
    if (error?.length) {
      setTimeout(() => setError(""), 5000);
    }
  }, [error]);

  const openGmail = () => {
    window.location.href = "https://gmail.com/";
  };

  const [sendResetLink, { isLoading }] = useSendResetLinkMutation();

  const onSubmit = (data: FieldValues) => {
    sendResetLink((data as SigninPayload).username)
      .unwrap()
      .then(() => {
        dispatch(
          openActionModal({
            title: "Link Sent",
            isOpen: true,
            type: "success",
            content:
              "A password reset link has been sent to your email. Click the link to reset your password",
            callbackText: "Open Email",
            callback: openGmail,
            cancelContent: (
              <Link className={styles.link} to="/auth/login">
                Back To Login
              </Link>
            ),
            colFlex: true,
          })
        );
      })
      .catch((error: any) => {
        console.error(error);
        setError(error.data?.message || "Could not verify, Please try again.");
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <h3>Reset Password</h3>
        <p>
          Kindly enter email address to reset your password. A reset link would
          be sent to this email address.
        </p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
          <FormElement
            type="email"
            fieldName="email"
            fieldLabel="Email Address"
            placeholder="admin@softgate.com"
            isValidated
            validateFn={(value) => validateEmail(value as string)}
            required
          />
          <small className={styles.error}>{error}</small>
          <div className={styles.buttonContainer}>
            <Button
              text={"Send Reset Link"}
              type="submit"
              isLoading={isLoading}
            />
            <Link to="/auth/login" replace>
              Back To Login
            </Link>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default ForgotPassword;
