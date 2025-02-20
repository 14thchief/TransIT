import styles from "./styles.module.scss";
import { useSelector } from "react-redux";
import { selectBusiness } from "src/redux/features/admin/util/businessSlice";
// import { toast } from "react-toastify";
import {
  useGenerateAPIKeysMutation,
  useGetBusinessAPIKeysQuery,
  useRegenerateAPIKeysMutation,
  useUpdateAPIKeysMetaMutation,
} from "src/redux/features/admin/gatewaySlice";
import FormElement from "components/Core/FormElements/FormElement";
import CopyToClipboard from "components/Global/CopyToClipboard";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { validateUrl } from "src/constants/validations";
import { useEffect, useState } from "react";
import Button from "components/Core/Button";
import PermissionWrapper from "components/Global/PermissionWrapper";

const APIKeys = () => {
  const methods = useForm({ mode: "all" });
  const { reset, handleSubmit } = methods;

  const methodsTest = useForm({ mode: "all" });
  const { reset: resetTest, handleSubmit: handleSubmitTest } = methodsTest;

  const { highlightedBusiness } = useSelector(selectBusiness);
  const { data: testAPIKeys } = useGetBusinessAPIKeysQuery(
    {
      businessID: highlightedBusiness?.id as string,
      environment: "test",
    },
    {
      skip: !highlightedBusiness,
    }
  );
  const { data: liveAPIKeys } = useGetBusinessAPIKeysQuery(
    {
      businessID: highlightedBusiness?.id as string,
      environment: "live",
    },
    {
      skip: !highlightedBusiness,
    }
  );

  useEffect(() => {
    if (testAPIKeys) {
      resetTest({
        "web-hook_url_test": testAPIKeys.webhook_url,
        callback_url_test: testAPIKeys.callback_url,
      });
    }

    if (liveAPIKeys) {
      reset({
        "web-hook_url_live": liveAPIKeys.webhook_url,
      });
    }
  }, [testAPIKeys, liveAPIKeys]);

  const [generatedKeys, setGeneratedKeys] = useState({
    test: {
      public_key: "",
      secret_key: "",
    },
    live: {
      public_key: "",
      secret_key: "",
    },
  });

  const [environment, setEnvironment] = useState<EnvironmentType | null>(null);
  const [generateKey, { isLoading: isGenerating }] =
    useGenerateAPIKeysMutation();

  const [regenerateKey, { isLoading: isRegenerating }] =
    useRegenerateAPIKeysMutation();

  const [updateMeta, { isLoading: isUpdating }] =
    useUpdateAPIKeysMetaMutation();

  const handleGenerateTestAPIKey = (formData: FieldValues) => {
    if (!highlightedBusiness?.id) {
      return;
    }

    setEnvironment("test");

    const fmtData = {
      business_id: highlightedBusiness?.id,
      environment: "test",
      webhook_url: formData?.["web-hook_url_test"],
      callback_url: formData?.callback_url_test,
    };

    const updateCondition =
      fmtData.callback_url !== testAPIKeys?.callback_url ||
      fmtData.webhook_url !== testAPIKeys?.webhook_url;

    if (testAPIKeys) {
      regenerateKey(fmtData)
        .then(({ data }) => {
          setGeneratedKeys((prev) => ({
            ...prev,
            test: data,
          }));
        })
        .then(() => {
          if (updateCondition) {
            updateMeta(fmtData).catch((error) => console.error(error));
          }
          setEnvironment(null);
        })
        .catch((error) => {
          console.error({ error });
        });
    } else {
      generateKey(fmtData)
        .then(({ data }) => {
          setGeneratedKeys((prev) => ({
            ...prev,
            test: data,
          }));
          setEnvironment(null);
        })
        .catch((error) => {
          console.error({ error });
        });
    }
  };

  const handleGenerateLiveAPIKey = (formData: FieldValues) => {
    if (!highlightedBusiness?.id) {
      return;
    }

    setEnvironment("live");

    const fmtData = {
      business_id: highlightedBusiness?.id,
      environment: "live",
      webhook_url: formData?.["web-hook_url_live"],
      callback_url: formData?.callback_url_live,
    };

    const updateCondition =
      fmtData.callback_url !== liveAPIKeys?.callback_url ||
      fmtData.webhook_url !== liveAPIKeys?.webhook_url;

    if (liveAPIKeys) {
      regenerateKey(fmtData)
        .then(({ data }) => {
          setGeneratedKeys((prev) => ({
            ...prev,
            live: data,
          }));
        })
        .then(() => {
          if (updateCondition) {
            updateMeta(fmtData).catch((error) => console.error(error));
          }
          setEnvironment(null);
        })
        .catch((error) => {
          console.error({ error });
        });
    } else {
      generateKey(fmtData)
        .then(({ data }) => {
          setGeneratedKeys((prev) => ({
            ...prev,
            live: data,
          }));
          setEnvironment(null);
        })
        .catch((error) => {
          console.error({ error });
        });
    }
  };

  const isLoading = isGenerating || isRegenerating || isUpdating;
  const isLive = environment == "live";
  const isTest = environment == "test";
  const isRegenerateLive =
    generatedKeys.live?.public_key ||
    generatedKeys.live?.secret_key ||
    liveAPIKeys;
  const isRegenerateTest =
    generatedKeys.test?.public_key ||
    generatedKeys.test?.secret_key ||
    testAPIKeys;

  return (
    <div className={styles.container}>
      <div className={styles.list}>
        <div className={styles.column}>
          <h4 className={styles.title}>Live API Keys</h4>
          <FormProvider key={1} {...methods}>
            <form
              onSubmit={(event) =>
                void handleSubmit(handleGenerateLiveAPIKey)(event)
              }
            >
              <div className={styles.row}>
                <FormElement
                  defaultValue={generatedKeys?.live?.public_key}
                  fieldName="public_key_live"
                  placeholder="Public key will be displayed here..."
                  type="text"
                  isDisabled
                />
                <CopyToClipboard value={generatedKeys?.live?.public_key} />
              </div>
              <div className={styles.row}>
                <FormElement
                  defaultValue={generatedKeys?.live?.secret_key}
                  fieldName="secret_key_live"
                  placeholder="Secret key will be displayed here..."
                  type="text"
                  isDisabled
                />
                <CopyToClipboard value={generatedKeys?.live?.secret_key} />
              </div>
              <div className={styles.row}>
                <FormElement
                  defaultValue={liveAPIKeys?.callback_url}
                  fieldName="callback_url_live"
                  type="text"
                  isValidated
                  validateFn={(value) => validateUrl(value as string)}
                />
              </div>
              <div className={styles.row}>
                <FormElement
                  defaultValue={liveAPIKeys?.webhook_url}
                  fieldName="web-hook_url_live"
                  type="text"
                  isValidated
                  validateFn={(value) => validateUrl(value as string)}
                />
              </div>
              <PermissionWrapper permission="business-api-key:create">
                <div className={styles.row}>
                  <Button
                    // variant="main-reverse"
                    type="submit"
                    disabled={isGenerating}
                    text={
                      isLoading && isLive
                        ? "Please Wait..."
                        : isRegenerateLive
                        ? "Regenerate Live Keys"
                        : "Generate Live Keys"
                    }
                  />
                </div>
              </PermissionWrapper>
            </form>
          </FormProvider>
        </div>
        <div className={styles.column}>
          <h4 className={styles.title}>Test API Keys</h4>
          <FormProvider key={2} {...methodsTest}>
            <form
              onSubmit={(event) =>
                void handleSubmitTest(handleGenerateTestAPIKey)(event)
              }
            >
              <div className={styles.row}>
                <FormElement
                  defaultValue={generatedKeys?.test?.public_key}
                  fieldName="public_key"
                  placeholder="Public key will be displayed here..."
                  type="text"
                  isDisabled
                />
                <CopyToClipboard value={generatedKeys?.test?.public_key} />
              </div>
              <div className={styles.row}>
                <FormElement
                  defaultValue={generatedKeys?.test?.secret_key}
                  fieldName="secret_key"
                  placeholder="Secret key will be displayed here..."
                  type="text"
                  isDisabled
                />
                <CopyToClipboard value={generatedKeys?.test?.secret_key} />
              </div>
              <div className={styles.row}>
                <FormElement
                  defaultValue={testAPIKeys?.callback_url}
                  fieldName="callback_url_test"
                  type="text"
                  isValidated
                  validateFn={(value) => validateUrl(value as string)}
                />
              </div>
              <div className={styles.row}>
                <FormElement
                  defaultValue={testAPIKeys?.webhook_url}
                  fieldName="web-hook_url_test"
                  type="text"
                  isValidated
                  validateFn={(value) => validateUrl(value as string)}
                />
              </div>
              <PermissionWrapper permission="business-api-key:create">
                <div className={styles.row}>
                  <Button
                    // variant="main-reverse"
                    type="submit"
                    disabled={isGenerating}
                    text={
                      isLoading && isTest
                        ? "Please Wait..."
                        : isRegenerateTest
                        ? "Regenerate Test Keys"
                        : "Generate Test Keys"
                    }
                  />
                </div>
              </PermissionWrapper>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};

export default APIKeys;
