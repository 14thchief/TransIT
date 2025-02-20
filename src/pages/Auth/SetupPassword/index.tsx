import FormElement from "components/Core/FormElements/FormElement";
import styles from "./_styles.module.scss";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import Button from "components/Core/Button";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useSavePasswordMutation } from "src/redux/features/auth/loginSlice";
import { ResetPasswordPayload } from "src/redux/features/auth/types/loginType";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";

const SetupPassword = () => {
  const methods = useForm({ mode: "all" });
  const { handleSubmit } = methods;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState("");
  useEffect(() => {
    if (error?.length) {
      setTimeout(() => setError(""), 5000);
    }
  }, [error]);

  const [savePassword, { isLoading }] = useSavePasswordMutation();

  const onSubmit = (data: FieldValues) => {
    const fmtData = {
      ...data,
      token,
    };

    savePassword(fmtData as ResetPasswordPayload)
      .unwrap()
      .then(() => {
        toast.success("Password Saved Successfully");
        navigate("/auth/login");
      })
      .catch((error: any) => {
        console.error(error);
        setError(
          typeof error.data?.message === "string"
            ? error.data?.message
            : error.data?.message?.[0] || "Could not verify, Please try again."
        );
      });
    //
  };

  return (
    <div className={styles.container}>
      <div className={styles.heading}>
        <h3>Setup Account Password</h3>
        <p>Enter new password and confirm password to activate your account.</p>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={(event) => void handleSubmit(onSubmit)(event)}>
          <FormElement
            type="password"
            fieldName="password"
            fieldLabel="Password"
            placeholder="********"
            required
          />
          <FormElement
            type="password"
            fieldName="confirmPassword"
            fieldLabel="Confirm Password"
            placeholder="********"
            required
          />
          <small className={styles.error}>{error}</small>
          <div className={styles.buttonContainer}>
            <Button
              text={"Save Password"}
              type="submit"
              isLoading={isLoading}
            />
            <Link to="/auth/login" replace>
              Go To Login
            </Link>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default SetupPassword;
