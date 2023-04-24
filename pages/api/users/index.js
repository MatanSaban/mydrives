import { createUser, getUsers } from "../../../lib/controllers/users";
import connectMongo from "../../../lib/db";
// import { createUser } from "../../../models/Users";



export default async function handler(req, res) {
    connectMongo().catch(() =>
        res.status(405).json({ error: "Error in the connection" })
    );

    // type of request
    // ['GET', 'POST', 'PUT', 'DELETE']
    const { method } = req;
    switch (method) {
        case "GET":
            getUsers(req, res); 
            break;
        case "POST":
            createUser(req, res);
            break;
        default:
            res.setHeader("Allow", ["GET", "POST"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
