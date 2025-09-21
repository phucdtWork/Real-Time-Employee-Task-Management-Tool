import { AppForm } from "../../../components";
import { useNavigate } from "react-router-dom";
import checkCurrentUser from "../../../utils/checkCurrentUser";
import { useEffect, useState } from "react";
import {
  CreateNewAccessCode,
  ValidateAccessCode,
} from "../../../apis/commonAPI";
import { toast } from "react-toastify";

function LoginPage() {
  const [setep, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  //create login form with antd design
  const handleSubmitPhoneNumber = async (values) => {
    setLoading(true);
    try {
      const response = await CreateNewAccessCode(values.phoneNumber);
      if (response) {
        setStep(2);
        setPhoneNumber(values.phoneNumber);
        toast.success("Access code sent to your phone.");
        setLoading(false);
      }
      setLoading(false);
    } catch (error) {
      if (error.status === 404) {
        setLoading(false);
        toast.error("User not found. or not an owner.");
      } else {
        setLoading(false);
        toast.error("Error creating access code.", error.message);
      }
    }
  };

  const handleNavigateByRole = () => {
    const role = localStorage.getItem("role");
    if (role === "owner") {
      navigate("/manage-employee");
    } else {
      navigate("/manage-task");
    }
  };

  const handleSubmitAccessCode = async (values) => {
    setLoading(true);
    try {
      const response = await ValidateAccessCode(phoneNumber, values.code);
      setLoading(false);
      if (response?.success) {
        localStorage.setItem("access_token", response.token);
        localStorage.setItem("role", response.role);
        toast.success("Login successful!");
        handleNavigateByRole();
        setLoading(false);
      } else {
        toast.error(response?.error || "Invalid access code.");
        console.error("Error validating access code:", response?.error);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error validating access code:", error);
      toast.error("Error validating access code.");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };
  const handleFooterAction = () => {
    navigate("/employee-login");
  };

  return (
    <div>
      {setep === 1 ? (
        <AppForm
          formType={"phoneNumber"}
          onSubmit={(values) => handleSubmitPhoneNumber(values)}
          onBack={handleBack}
          loading={loading}
          footerAction={handleFooterAction}
        />
      ) : (
        <AppForm
          formType={"code"}
          loading={loading}
          onSubmit={(values) => handleSubmitAccessCode(values)}
          onBack={() => setStep(1)}
          footerAction={handleFooterAction}
        />
      )}
    </div>
  );
}

export default LoginPage;
