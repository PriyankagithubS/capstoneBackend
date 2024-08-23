import User from "../Models/user.Schema.js";
import { createJWT } from "../utils/jwt.js";
import Notice from "../Models/notification.Schema.js";

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, isAdmin, role, title } = req.body;
        const userExist = await User.findOne({ email });

        if (userExist) {
            return res.status(400).json({ status: false, message: "User already exists" });
        }

        const user = await User.create({ name, email, password, isAdmin, role, title });
        const token = createJWT(user._id);

        res.status(201).json({ status: true, message: "User registered successfully", user: { name, email, isAdmin, role }, token });
    } catch (error) {
        res.status(500).json({ status: false, message: "Server error" });
    }
};

// User login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ status: false, message: "Invalid email or password" });
        }

        if (!user.isActive) {
            return res.status(403).json({ status: false, message: "Account is deactivated" });
        }

        const token = createJWT(user._id);
        res.status(200).json({
            status: true,
            message: "Login successful",
            token: token,  // Ensure the token is being sent
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                title: user.title,
                role: user.role,
                isAdmin: user.isAdmin,
                isActive: user.isActive
            }
        });

    } catch (error) {
        res.status(500).json({ status: false, message: "Server error" });
    }
};





// User logout
export const logoutUser = (req, res) => {
    res.status(200).json({ status: true, message: "Logout successful" });
};

export const getTeamList = async (req, res) => {
    try {
        const users = await User.find().select("name title role email isActive");

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ status: false, message: "Server error" });
    }
};

export const getNotificationsList = async (req, res) => {
    try {
        const { userId } = req.user;

        const notice = await Notice.find({
            team: userId,
            isRead: { $nin: [userId] },
        }).populate("task", "title");

        res.status(200).json(notice);
    } catch (error) {
        res.status(500).json({ status: false, message: "Server error" });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        const { userId, isAdmin } = req.user;
        const { _id } = req.body;

        const id =
            isAdmin && userId === _id
                ? userId
                : isAdmin && userId !== _id
                    ? _id
                    : userId;

        const user = await User.findById(id);

        if (user) {
            user.name = req.body.name || user.name;
            user.title = req.body.title || user.title;
            user.role = req.body.role || user.role;

            const updatedUser = await user.save();

            updatedUser.password = undefined;

            res.status(200).json({
                status: true,
                message: "Profile Updated Successfully.",
                user: updatedUser,
            });
        } else {
            res.status(404).json({ status: false, message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: "Server error" });
    }
};

export const markNotificationRead = async (req, res) => {
    try {
        const { userId } = req.user;

        const { isReadType, id } = req.query;

        if (isReadType === "all") {
            await Notice.updateMany(
                { team: userId, isRead: { $nin: [userId] } },
                { $push: { isRead: userId } },
                { new: true }
            );
        } else {
            await Notice.findOneAndUpdate(
                { _id: id, isRead: { $nin: [userId] } },
                { $push: { isRead: userId } },
                { new: true }
            );
        }

        res.status(200).json({ status: true, message: "Notifications marked as read" });
    } catch (error) {
        res.status(500).json({ status: false, message: "Server error" });
    }
};

export const changeUserPassword = async (req, res) => {
    try {
        const { userId } = req.user;

        const user = await User.findById(userId);

        if (user) {
            user.password = req.body.password;

            await user.save();

            user.password = undefined;

            res.status(200).json({
                status: true,
                message: "Password changed successfully.",
            });
        } else {
            res.status(404).json({ status: false, message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: "Server error" });
    }
};

export const activateUserProfile = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (user) {
            user.isActive = req.body.isActive;

            await user.save();

            res.status(200).json({
                status: true,
                message: `User account has been ${user.isActive ? "activated" : "disabled"}`,
            });
        } else {
            res.status(404).json({ status: false, message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ status: false, message: "Server error" });
    }
};

export const deleteUserProfile = async (req, res) => {
    try {
        const { id } = req.params;

        await User.findByIdAndDelete(id);

        res.status(200).json({ status: true, message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ status: false, message: "Server error" });
    }
};
