import {
  createUser,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
} from "../../../lib/controllers/users";
import connectMongo from "../../../lib/db";

export default async function handler(req, res) {
  connectMongo().catch(() =>
    res.status(405).json({ error: "Error in the connection" })
  );

  const { method } = req;
  switch (method) {
    case "GET":
      if (req.query.email) {
        getUserByEmail(req, res);
      } else if (req.query.id) {
        getUserById(req, res);
      } else {
        res.status(400).json({
          error: "Please provide an email or id",
        });
      }
      break;
    case "PUT":
    case "PATCH":
      updateUser(req, res);
      break;
    case "DELETE":
      deleteUser(req, res);
      break;
    default:
      res.setHeader("Allow", ["GET", "PUT", "PATCH", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
