import { loginUser } from "../../../lib/controllers/users";
import connectMongo from "../../../lib/db";

export default async function handler(req, res) {
  connectMongo().catch(() => {
    // console.log("here");
    return res.status(405).json({ error: "Error in the connection" });
  });
  if (req.method === "POST") {
    try {
      const result = await loginUser(req, res);
      if (!res.headersSent) {
        return res.status(200).json(result);
      }
    } catch (error) {
      console.error("Error logging in user:", error);
      if (!res.headersSent) {
        return res.status(500).json({ error: "Error logging in." });
      }
    }
  }
  if (!res.headersSent) {
    return res.status(400).json({ error: "Invalid request method." });
  }
}
