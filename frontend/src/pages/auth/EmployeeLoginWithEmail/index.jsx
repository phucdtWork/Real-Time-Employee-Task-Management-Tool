import { useNavigate } from "react-router-dom";
import { AppForm } from "../../../components";
import { useEffect, useState } from "react";
import { LoginEmail, ValidateAccessCodeEmail } from "../../../apis/commonAPI";
import { toast } from "react-toastify";
import checkCurrentUser from "../../../utils/checkCurrentUser";

function EmployeeLoginWithEmail() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const navigate = useNavigate();

  const handleSubmitEmail = async (values) => {
    setLoading(true);
    try {
      const response = await LoginEmail(values.email);
      if (response) {
        setEmail(values.email);
        setStep(2);
        setLoading(false);
        toast.success("Access code sent to your email.");
      } else {
        toast.error(response?.error);
        console.error("Error sending login email:", response?.error);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.error || "Error sending login email.");
      console.error("Error sending login email:", error);
    }
  };

  const handleSubmitAccessCode = (values) => {
    setLoading(true);

    ValidateAccessCodeEmail(email, values.code)
      .then((response) => {
        setLoading(false);
        if (response?.success) {
          localStorage.setItem("access_token", response.token);
          localStorage.setItem("role", response.role);
          localStorage.setItem("phoneNumber", response.phoneNumber);
          navigate("/manage-task");
          toast.success("Login successful!");
        } else {
          toast.error(response?.error || "Invalid access code.");
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error validating access code:", error);
        toast.error("Error validating access code.");
      });
  };

  const handleBack = () => {
    navigate(-1);
  };
  const handleBackAccessCode = () => {
    setStep(1);
  };

  const handleFooterAction = () => {
    console.log("Footer Action");
  };

  return (
    <>
      {step === 1 && (
        <AppForm
          formType={"email"}
          onSubmit={(values) => handleSubmitEmail(values)}
          onBack={handleBack}
          footerAction={handleFooterAction}
          loading={loading}
        />
      )}
      {step === 2 && (
        <AppForm
          formType={"code"}
          onSubmit={(values) => handleSubmitAccessCode(values)}
          onBack={handleBackAccessCode}
          footerAction={handleFooterAction}
          loading={loading}
        />
      )}
    </>
  );
}

export default EmployeeLoginWithEmail;
