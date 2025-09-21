import e, { Router } from "express";
import EmployeeController from "../controller/EmployeeController.js";

const employeeRouter = Router();

employeeRouter.put("/update-profile", EmployeeController.updateProfile);
employeeRouter.get("/profile", EmployeeController.getProfile);


//task routes
employeeRouter.put("/update-task/:id", EmployeeController.updateTaskStatus);
employeeRouter.get("/my-tasks", EmployeeController.getMyTasks);

export { employeeRouter };
