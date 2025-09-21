import { Router } from "express";
import OwnerController from "../controller/OwnerController.js";


const ownerRouter = Router();

// Employee routes
ownerRouter.post("/create-employee", OwnerController.CreateEmployee);
ownerRouter.get("/get-all-employees", OwnerController.getAllUsers);
ownerRouter.get("/get-employee/:id", OwnerController.GetEmployee);
ownerRouter.put("/update-employee/:id", OwnerController.updateUser);
ownerRouter.delete("/delete-employee/:id", OwnerController.DeleteEmployee);

// Task routes
ownerRouter.get("/get-all-tasks", OwnerController.getAllTasks);
ownerRouter.post("/create-task", OwnerController.createTask);
ownerRouter.put("/update-task/:id", OwnerController.updateTask);
ownerRouter.delete("/delete-task/:id", OwnerController.deleteTask);




export { ownerRouter };