import bcrypt from "bcryptjs";
import userService from "../services/user.js";
import { generateToken, verifyToken } from "../utils/jwtConfig.js";
import EmailAccessCode from "../services/emailAccessService.js";
import generateAccessCode from "../utils/generateAccessCode.js";
import taskService from "../services/task.js";

class EmployeeController {

    async login(req, res) {
        try {
            const { username, password } = req.body;

            const existingUser = await userService.getUserByUsername(username);
            if (existingUser && existingUser?.data?.isDelete === true) {
                return res.status(404).json({ success: false, error: "User not found" });
            }

            const result = await userService.authenticateEmployee(username, password);
            if (result?.success) {

                const token = generateToken(
                    {
                        email: result.data.email,
                        role: result.data.role
                    }
                );
                res.status(200).json({
                    success: true,
                    role: result.data.role,
                    phoneNumber: result.data.phoneNumber,
                    token: token
                });
            } else {
                res.status(401).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }


    async getCurrentUser(req, res) {
        try {
            const authorization = req?.headers["authorization"];
            if (!authorization) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const token = authorization.split(" ")[1];
            const decoded = verifyToken(token);
            const existingUser = await userService.getUserByEmail(decoded.email);
            if (!existingUser) {
                return res.status(404).json({
                    success: false,
                    error: "User not found"
                });
            }
            res.status(200).json({
                success: true,
                data: existingUser
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }


    async registerAccount(req, res) {
        try {
            const token = req.query?.token || null;
            const decoded = verifyToken(token);

            const { password, username } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);

            const existingUser = await userService.getUserByUsername(username);
            if (existingUser && existingUser.data?.username) {
                return res.status(400).json({
                    success: false,
                    error: "Username already exists"
                });
            }


            const result = await userService.updateEmployeeProfile(decoded.email, { ...req.body, password: hashedPassword, isComplete: true });

            if (result.success) {
                if (result.data.isComplete === true) {
                    res.status(200).json({
                        success: true,
                        message: "Account registration complete",
                        data: result.data
                    });
                } else {
                    res.status(200).json({
                        success: true,
                        message: "Account updated successfully",
                        data: result.data
                    });
                }
            } else {
                res.status(400).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error
            });
            console.log(error);

        }
    }

    async updateProfile(req, res) {
        try {
            const authorization = req?.headers["authorization"];
            const tokenExample = authorization.split(" ")[1];
            const decoded = verifyToken(tokenExample);

            const result = await userService.updateEmployeeProfile(decoded.email, req.body);
            if (result.success) {
                res.status(200).json({
                    success: true,
                    message: "Profile updated successfully",
                    data: result.data
                });
            } else {
                res.status(400).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error
            });
            console.log(error);
        }
    }


    async getProfile(req, res) {
        try {
            const authorization = req?.headers["authorization"];
            const tokenExample = authorization.split(" ")[1];
            const decoded = verifyToken(tokenExample);

            const existingUser = await userService.getUserByEmail(decoded.email);
            if (existingUser) {
                res.status(200).json({
                    success: true,
                    data: existingUser
                });
            } else {
                res.status(404).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async LoginEmail(req, res) {
        try {
            const { email } = req.body;

            const existingUser = userService.getUserByEmail(email);
            if (!existingUser) {
                return res.status(404).json({ success: false, error: "User not found" });
            }
            const accessCode = generateAccessCode();

            await EmailAccessCode.storeAccessCode(email, accessCode);
            const result = await EmailAccessCode.sendAccessCodeEmail(email, accessCode);
            if (result.success) {
                res.status(200).json(accessCode);
            } else {
                res.status(500).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            console.error('Error in sendLoginEmail:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async ValidateAccessCode(req, res) {
        try {
            const { email, accessCode } = req.body;

            await EmailAccessCode.checkValidAndClearAccessCode(email, accessCode)
                .then(result => {
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
                            phoneNumber: result.data.phoneNumber,
                            token: token
                        });
                    } else {
                        res.status(400).json({ success: false, error: "Invalid access code" });
                    }
                });
        } catch (error) {
            console.error('Error in validateAccessCode:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async getMyTasks(req, res) {
        try {
            const authorization = req?.headers["authorization"];
            const token = authorization.split(" ")[1];
            const decoded = verifyToken(token);
            if (!authorization) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const existingUser = await userService.getUserByEmail(decoded.email);
            if (!existingUser) {
                return res.status(404).json({
                    success: false,
                    error: "User not found"
                });
            }


            const result = await taskService.getTasksByAssignedTo(existingUser?.data?.id);
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
            console.error('Error in getMyTasks:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async updateTaskStatus(req, res) {
        try {
            const { id } = req.params;

            const result = await taskService.updateTask(id, { status: "completed", updatedAt: new Date() });
            if (result.success) {
                res.status(200).json({
                    success: true
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: result.error
                });
            }
        } catch (error) {
            console.error('Error in updateTaskStatus:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

}

export default new EmployeeController();
