import { Router } from "express";
import EmployeeController from "../controller/EmployeeController.js";
import OwnerController from "../controller/OwnerController.js";

const commonRouter = Router();


//auth routes for Employee
commonRouter.post("/login", EmployeeController.login);
commonRouter.put("/register-account", EmployeeController.registerAccount);
commonRouter.post("/login-email", EmployeeController.LoginEmail);
commonRouter.post("/verify-otp", EmployeeController.ValidateAccessCode);

commonRouter.get("/current-user", EmployeeController.getCurrentUser);

// login with phone number and access code
commonRouter.post("/create-access-code", OwnerController.CreateNewAccessCode);
commonRouter.post("/validate-access-code", OwnerController.ValidateAccessCode);

export { commonRouter };
