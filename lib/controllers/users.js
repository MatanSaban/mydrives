import Users from "../../models/Users";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";



async function filterSensitiveFields(user) {
  const { password, __v, ...rest } = user.toObject();
  return rest;
}

export async function getUsers(req, res) {
  try {
    const users = await Users.find({});
    const filteredUsers = await Promise.all(users.map(filterSensitiveFields));
    if (!filteredUsers.length) return res.status(404).json({ error: "Data not found" });
    res.status(200).json({ users: filteredUsers });
  } catch (error) {
    res.status(500).json({ error: "server error 500, the error: " + error });
  }
}

export async function getUserById(req, res) {
  const id = req.query.id;
  try {
    const user = await Users.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });
    const filteredUser = await filterSensitiveFields(user);
    res.status(200).json({ user: filteredUser });
  } catch (error) {
    return res.status(500).json({ error: "Server Error 500, the Error: " + error });
  }
}

export async function getUserByEmail(req, res) {
  const email = req.query.email;
  try {
    const user = await Users.findOne({ email: email });
    if (!user) return res.status(404).json({ error: "User not found" });
    const filteredUser = await filterSensitiveFields(user);
    res.status(200).json({ user: filteredUser });
  } catch (error) {
    return res.status(500).json({ error: "Server Error 500, the Error: " + error });
  }
}

export async function createUser(req, res) {
    try {
        const data = req.body;
        const email = data.email;
        // Check if user already exists
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "Email already exists" });
        }

        if (!data)
            return res
                .status(400)
                .json({ error: "Please fill in all required fields" });

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        data.password = hashedPassword;

        const user = await Users.create(data);
        const filteredUser = await filterSensitiveFields(user);

        // Generate JWT token and send it back to the client
        const token = jwt.sign(
            { userId: filteredUser._id },
            process.env.JWT_SECRET
        );
        res.status(201).json({ user: filteredUser, token });
    } catch (error) {
        return res.status(500).json(error);
    }
}



export async function updateUser(req, res) {
    try {
        const data = req.body;
        const identifier = req.query.id;

        // Check if the password field is present in the request body
        if (data.password) {
            // Hash the password using bcrypt
            const salt = await bcrypt.genSalt(10);
            data.password = await bcrypt.hash(data.password, salt);
        }

        const updatedUser = await Users.findOneAndUpdate(identifier, data, {
            new: true,
        });

        if (!updatedUser)
            return res.status(400).json({ error: "Failed to update the user" });

        const filteredUser = await filterSensitiveFields(updatedUser);
        res.status(200).json(filteredUser);
    } catch (error) {
        res.status(500).json({
            error: "Internal server error 500, the error: " + error,
        });
    }
}


export async function deleteUser(req, res) {
    try {
        const identifier = req.query.id;
        const deletedUser = await Users.findOneAndDelete(identifier);
        if (!deletedUser)
            return res
                .status(400)
                .json({
                    error: "Error: no user found, so no user deleted bitch.",
                });
        const { password, __v, ...userData } = deletedUser.toObject(); // exclude password and __v
        res.status(200).json({
            message: "User deleted successfully",
            user: userData,
        });
    } catch (error) {
        res.status(500).json({
            error: "Internal server Error 500, the error : " + error,
        });
    }
}

export async function loginUser(req, res) {
    const { email, password } = req.body;

    try {
        const user = await Users.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res
                .status(401)
                .json({ error: "Incorrect email or password" });
        }

        const payload = {
            user: {
                id: user._id,
            },
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            
        });

        res.status(200).json({ token, user });
    } catch (error) {
        res.status(500).json({
            error: `Internal server error: ${error.message}`,
        });
    }
}