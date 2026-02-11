import { where } from "sequelize";
import db from "../models/index";
import bcrypt from "bcryptjs";

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                let user = await db.User.findOne({
                    where: { email: email },
                });
                console.log("check user", user);
                if (user) {
                    let checkPassword = bcrypt.compareSync(password, user.password);
                    if (checkPassword) {
                        userData.errCode = 0;
                        userData.errMessage = "ok";
                        userData.user = {
                            id: user.id,
                            email: user.email,
                            roleId: user.roleCode,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            phoneNumber: user.phoneNumber,
                        };
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = "sai mat khau";
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = "User not found";
                }
            } else {
                userData.errCode = 2;
                userData.errMessage = "User not found";
            }
            resolve(userData);
        } catch (error) {
            reject(error);
        }
    });
};

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail },
            });
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            reject(error);
        }
    });
};

const getAllCodes = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            const allcodes = await db.Allcode.findAll({
                where: { type: typeInput },
                attributes: ["keyName", "type", "valueEn", "valueVi"],
            });

            if (allcodes && allcodes.length > 0) {
                resolve({
                    errCode: 0,
                    errMessage: "data fetched successfully",
                    data: allcodes,
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: "No data found",
                    data: [],
                });
            }
        } catch (error) {
            reject({
                errCode: -1,
                errMessage: "Error from server",
            });
        }
    });
};

const createUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Check existing email
            const existingUser = await checkUserEmail(data.email);
            if (existingUser) {
                resolve({
                    errCode: 1,
                    errMessage: "Email already exists",
                });
                return;
            }

            // Hash password
            const hashPassword = await bcrypt.hashSync(data.password, 10);

            // Create new user
            await db.User.create({
                email: data.email,
                password: hashPassword,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address || null,
                phoneNumber: data.phoneNumber || null,
                genderCode: data.genderCode || null,
                roleCode: data.roleCode || "R3", // Default role
                positionCode: data.positionCode || null,
                image: data.image || null,
            });

            resolve({
                errCode: 0,
                errMessage: "User created successfully",
            });
        } catch (error) {
            reject({
                errCode: -1,
                errMessage: "Error from server",
            });
        }
    });
};

const getAllUsers = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const users = await db.User.findAll({
                attributes: {
                    exclude: ["password"], // Exclude sensitive data
                },
                include: [
                    {
                        model: db.Allcode,
                        as: "genderData",
                        attributes: ["valueEn", "valueVi"],
                    },
                    {
                        model: db.Allcode,
                        as: "roleData",
                        attributes: ["valueEn", "valueVi"],
                    },
                    {
                        model: db.Allcode,
                        as: "positionData",
                        attributes: ["valueEn", "valueVi"],
                    },
                    { model: db.Markdown, as: "userMarkdown" },
                ],
                raw: true,
                nest: true,
            });

            if (users && users.length > 0) {
                resolve({
                    errCode: 0,
                    errMessage: "Users fetched successfully",
                    data: users,
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: "No users found",
                    data: [],
                });
            }
        } catch (error) {
            reject({
                errCode: -1,
                errMessage: "Error from server",
            });
        }
    });
};

let getUsersByRole = (roleCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!roleCode) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter: roleCode",
                });
                return;
            }

            const users = await db.User.findAll({
                where: { roleCode: roleCode },
                attributes: {
                    exclude: ["password"], // Exclude sensitive data
                },
                include: [
                    {
                        model: db.Allcode,
                        as: "genderData",
                        attributes: ["valueEn", "valueVi"],
                    },
                    {
                        model: db.Allcode,
                        as: "roleData",
                        attributes: ["valueEn", "valueVi"],
                    },
                    {
                        model: db.Allcode,
                        as: "positionData",
                        attributes: ["valueEn", "valueVi"],
                    },
                    {
                        model: db.Markdown,
                        as: "userMarkdown",
                    },
                ],
                raw: false,
                nest: true,
            });

            if (users && users.length > 0) {
                resolve({
                    errCode: 0,
                    errMessage: "Users fetched successfully",
                    data: users,
                    count: users.length,
                });
            } else {
                resolve({
                    errCode: 2,
                    errMessage: "No users found with this position",
                    data: [],
                });
            }
        } catch (error) {
            console.error("Error getting users by position:", error);
            reject({
                errCode: -1,
                errMessage: "Error from server",
            });
        }
    });
};
let getUsersByPosition = (positionCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!positionCode) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter: positionCode",
                });
                return;
            }

            const users = await db.User.findAll({
                where: { positionCode: positionCode },
                attributes: {
                    exclude: ["password"], // Exclude sensitive data
                },
                include: [
                    {
                        model: db.Allcode,
                        as: "genderData",
                        attributes: ["valueEn", "valueVi"],
                    },
                    {
                        model: db.Allcode,
                        as: "roleData",
                        attributes: ["valueEn", "valueVi"],
                    },
                    {
                        model: db.Allcode,
                        as: "positionData",
                        attributes: ["valueEn", "valueVi"],
                    },
                    {
                        model: db.Markdown,
                        as: "userMarkdown",
                    },
                ],
                raw: false,
                nest: true,
            });

            if (users && users.length > 0) {
                resolve({
                    errCode: 0,
                    errMessage: "Users fetched successfully",
                    data: users,
                    count: users.length,
                });
            } else {
                resolve({
                    errCode: 2,
                    errMessage: "No users found with this position",
                    data: [],
                });
            }
        } catch (error) {
            console.error("Error getting users by position:", error);
            reject({
                errCode: -1,
                errMessage: "Error from server",
            });
        }
    });
};

let getUserById = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter: userId",
                });
                return;
            }

            const user = await db.User.findOne({
                where: { id: userId },
                attributes: {
                    exclude: ["password"], // Exclude password for security
                },
                include: [
                    {
                        model: db.Allcode,
                        as: "genderData",
                        attributes: ["valueEn", "valueVi"],
                    },
                    {
                        model: db.Allcode,
                        as: "roleData",
                        attributes: ["valueEn", "valueVi"],
                    },
                    {
                        model: db.Allcode,
                        as: "positionData",
                        attributes: ["valueEn", "valueVi"],
                    },
                    {
                        model: db.Markdown,
                        as: "userMarkdown",
                    },
                ],
                raw: false,
                nest: true,
            });

            if (user) {
                resolve({
                    errCode: 0,
                    errMessage: "User fetched successfully",
                    data: user,
                });
            } else {
                resolve({
                    errCode: 2,
                    errMessage: "User not found",
                    data: null,
                });
            }
        } catch (error) {
            console.error("Error getting user by ID:", error);
            reject({
                errCode: -1,
                errMessage: "Error from server",
            });
        }
    });
};

let updateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.roleCode || !data.positionCode || !data.genderCode) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing required parameters!",
                });
            }

            let user = await db.User.findOne({
                where: { id: data.id },
            });

            if (user) {
                await user.update({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    genderCode: data.genderCode,
                    roleCode: data.roleCode,
                    positionCode: data.positionCode,
                });

                resolve({
                    errCode: 0,
                    errMessage: "Update user successfully!",
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: `User's not found!`,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
            });

            if (!user) {
                resolve({
                    errCode: 2,
                    errMessage: `The user isn't exist`,
                });
            }

            await db.User.destroy({
                where: { id: userId },
            });

            resolve({
                errCode: 0,
                errMessage: "User deleted successfully!",
            });
        } catch (e) {
            reject(e);
        }
    });
};

let createUserDescription = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.userId || !data.contentHTML || !data.contentMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!",
                });
            } else {
                // Check if description already exists for this event
                let existingMarkdown = await db.Markdown.findOne({
                    where: {
                        userId: data.userId,
                    },
                });

                if (existingMarkdown) {
                    // Update existing record
                    await existingMarkdown.update({
                        contentHTML: data.contentHTML,
                        contentMarkdown: data.contentMarkdown,
                        description: data.description,
                        image: data.image,
                    });
                } else {
                    // Create new record
                    await db.Markdown.create({
                        userId: data.userId,
                        contentHTML: data.contentHTML,
                        contentMarkdown: data.contentMarkdown,
                        description: data.description,
                        image: data.image,
                    });
                }

                resolve({
                    errCode: 0,
                    errMessage: "Save description successfully!",
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

const createHelpRequest = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra dữ liệu đầu vào bắt buộc
            if (!data.full_name || !data.email || !data.phone || 
                !data.help_type || !data.urgency_level || !data.problem_detail) {
                resolve({
                    errCode: 1,
                    errMessage: "Thiếu thông tin bắt buộc!"
                });
                return;
            }

            // Tạo yêu cầu hỗ trợ mới
            const newHelpRequest = await db.HelpRequest.create({
                full_name: data.full_name,
                email: data.email,
                phone: data.phone,
                organization: data.organization || null,
                help_type: data.help_type,
                urgency_level: data.urgency_level,
                available_time: data.available_time || null,
                contact_method: data.contact_method || null,
                problem_detail: data.problem_detail,
                attempted_solutions: data.attempted_solutions || null,
                additional_info: data.additional_info || null,
                status: "pending", // Mặc định là "pending"
                assigned_to: data.assigned_to || null
            });

            resolve({
                errCode: 0,
                errMessage: "Yêu cầu hỗ trợ đã được tạo thành công!",
                data: newHelpRequest,
                id: newHelpRequest.id,
            });
        } catch (error) {
            console.error("Lỗi khi tạo yêu cầu hỗ trợ:", error);
            reject({
                errCode: -1,
                errMessage: "Lỗi từ máy chủ"
            });
        }
    });
};
const getAllHelpRequest = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const helps = await db.HelpRequest.findAll({
                order: [["id", "DESC"]],
                raw: true,
                nest: true,
            });

            if (helps && helps.length > 0) {
                resolve({
                    errCode: 0,
                    errMessage: "Lấy danh sách yêu cầu hỗ trợ thành công",
                    data: helps,
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: "Không có yêu cầu nào nào",
                    data: [],
                });
            }
        } catch (error) {
            console.error("Get all helps error:", error);
            reject({
                errCode: -1,
                errMessage: "Lỗi từ server",
            });
        }
    });
};

export default {
    handleUserLogin: handleUserLogin,
    getAllCodes: getAllCodes,
    createUser: createUser,
    getAllUsers: getAllUsers,
    updateUser: updateUser,
    deleteUser: deleteUser,
    createUserDescription: createUserDescription,
    getUsersByPosition: getUsersByPosition, // Add new function
    getUserById: getUserById,
    getUsersByRole: getUsersByRole, // Add new function
    createHelpRequest: createHelpRequest,
    getAllHelpRequest: getAllHelpRequest,
};
