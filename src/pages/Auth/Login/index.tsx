import FormElement from "components/Core/FormElements/FormElement";
import styles from "./_styles.module.scss";
import { validateEmail } from "src/constants/validations";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import Button from "components/Core/Button";
import { useSignInMutation } from "src/redux/features/auth/loginSlice";
import { SigninPayload } from "src/redux/features/auth/types/loginType";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import { IoLogoApple } from "react-icons/io5";
import Divider from "components/Global/Divider";
// import usePersistentAuth from "src/hooks/usePersistentAuth";

const Login = () => {
  const methods = useForm({ mode: "all" });
  const { handleSubmit } = methods;
  //   const navigate = useNavigate();

  const [login, { isLoading }] = useSignInMutation();

  const onSubmit = (data: FieldValues) => {
    login(data as SigninPayload)
      .unwrap()
      .then((response) => {
        console.log({ response });
        response && toast.success("Signed in successfully");
        // navigate("/admin/businesses");
      })
      .catch((error: any) => {
        console.error(error);
      });
  };

  return (
    <div className={styles.login}>
      <div className={styles.heading}>
        <h3>Welcome back, Login to TransIT</h3>
      </div>

      <div className={styles.quickAuth}>
        <button>
          <div>
            <IoLogoApple size={24} color={"#000000"} />
          </div>
          Continue with Apple ID
        </button>
        <button>
          <div>
            <FcGoogle size={24} />
          </div>
          Continue with Google
        </button>
      </div>
      <Divider text="or" />

      <FormProvider {...methods}>
        <form
          className={styles.loginForm}
          onSubmit={(event) => void handleSubmit(onSubmit)(event)}
        >
          <FormElement
            type="email"
            fieldName="username"
            fieldLabel="Email Address"
            hideLabel
            placeholder="Enter e-mail"
            isValidated
            validateFn={(value) => validateEmail(value as string)}
            required
          />
          <FormElement
            type="password"
            fieldName="password"
            fieldLabel="Password"
            hideLabel
            placeholder="Enter password"
            required
          />
          <div className={styles.buttonContainer}>
            <Button text={"Login"} type="submit" isLoading={isLoading} />
          </div>
        </form>
        {/* <div className={styles.otherActions}>
          <FormElement
            type="checkbox"
            fieldName="keep_alive"
            fieldLabel="Keep me logged In"
          />

          <div className={styles.forgotPassword}>
            <p>Forgot Password?</p>
            <Link to={"/auth/forgot-password"}>Reset Password</Link>
          </div>
        </div> */}
      </FormProvider>
    </div>
  );
};

export default Login;
