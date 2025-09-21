import taskService from "../services/task.js";
import userService from "../services/user.js";
import { generateToken, verifyToken } from "../utils/jwtConfig.js";
import smsService from "../services/smsService.js";

import sendEmail from "../utils/sendSetupLink.js";
import generateAccessCode from "../utils/generateAccessCode.js";
import TextLink from "textlink-sms";

class OwnerController {

    async CreateEmployee(req, res) {
        try {

            const { email } = req.body;
            const existingUser = await userService.getUserByEmail(email);

            if (existingUser?.success === true && !existingUser?.data.isDelete) {
                return res.status(409).json({
                    success: false,
                    error: "User with this email already exists"
                });
            }
            const result = await userService.createUser(req.body);

            const setupToken = generateToken(
                {
                    email: result.data.email,
                    role: result.data.role,
                },
                '1d'
            );

            const setupLink = `${process.env.FRONTEND_EMPLOYEE_URL}?token=${setupToken}`;

            sendEmail(email, result.data.name, setupLink);
            res.status(201).json({
                success: true,
                employeeId: result.data.id,
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Get all users
    async getAllUsers(req, res) {
        try {
            const result = await userService.getAllUsers();

            if (result.success) {
                res.status(200).json({
                    success: true,
                    data: result.data.filter(user => !user.isDelete)
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            console.error('Error in getAllUsers:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Get user by ID
    async GetEmployee(req, res) {
        try {
            const { id } = req.params;


            const result = await userService.getUserById(id);

            if (result.success) {
                res.status(200).json(result.data);
            } else {
                res.status(404).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            console.error('Error in getUserById:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Update user
    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const result = await userService.updateUser(id, req.body);

            if (result.success) {
                res.status(200).json({
                    success: true,
                    message: "User updated successfully",
                    data: result.data
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            console.error('Error in updateUser:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    // Delete user
    async DeleteEmployee(req, res) {
        try {
            const { id } = req.params;
            const result = await userService.updateUser(id, { isDelete: true });

            if (result.success) {
                res.status(200).json({
                    success: true,
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            console.error('Error in deleteUser:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async createTask(req, res) {
        try {
            const taskData = req.body;
            const result = await taskService.createTask(taskData);

            if (result.success) {
                res.status(201).json({
                    success: true,
                    data: result.data
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            console.error('Error in createTask:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async getAllTasks(req, res) {
        try {
            const result = await taskService.getAllTasks();

            if (result.success) {
                res.status(200).json({
                    success: true,
                    data: result.data
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            console.error('Error in getAllTasks:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async updateTask(req, res) {
        try {
            const { id } = req.params;
            const result = await taskService.updateTask(id, req.body);
            if (result.success) {
                res.status(200).json({
                    success: true,
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: result.error
                });
            }

        } catch (error) {
            console.error('Error in updateTask:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async deleteTask(req, res) {
        try {
            const { id } = req.params;
            const result = await taskService.deleteTask(id);
            if (result.success) {
                res.status(200).json({
                    success: true,
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: result.error,
                });
            }
        } catch (error) {
            console.error('Error in deleteTask:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async sendSMS(phoneNumber, accessCode) {

        TextLink.useKey(process.env.TEXT_LINK_API_KEY);

        if (!phoneNumber || !accessCode) {
            return { success: false, error: 'Phone number and access code are required' };
        }
        try {
            const result = await TextLink.sendSMS(phoneNumber, accessCode);
            res.json({
                success: true,
                message: "SMS sent successfully",
                data: result
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Failed to send SMS",
                error: error.message
            });
        }
    }

    async CreateNewAccessCode(req, res) {
        try {
            const { phoneNumber } = req.body;

            const existingUser = await userService.getUserByPhoneNumber(phoneNumber);
            TextLink.useKey(process.env.TEXT_LINK_API_KEY);

            const accessCode = generateAccessCode();

            if (existingUser && existingUser?.data?.role === "owner") {
                await smsService.storeAccessCode(phoneNumber, accessCode);
                await TextLink.sendSMS(phoneNumber, `Your access code is: ${accessCode}`);
                res.status(200).json(accessCode);
            } else {
                res.status(404).json({
                    success: false,
                    error: 'User not found'
                });
            }

        } catch (error) {
            console.error('Error in CreateNewAccessCode:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }


    async ValidateAccessCode(req, res) {
        try {
            const { accessCode, phoneNumber } = req.body;
            const result = await smsService.checkValidAndClearAccessCode(phoneNumber, accessCode);
            if (result.success) {

                const token = generateToken(
                    {
                        email: result.data.email,
                        role: result.data.role
                    }
                );
                res.status(200).json({
                    success: true,
                    role: result.data.role,
                    token: token,
                });
            } else {
                res.status(400).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            console.error('Error in VerifyAccessCode:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

export default new OwnerController();