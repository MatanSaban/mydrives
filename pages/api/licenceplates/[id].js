import axios from "axios";
import connectMongo from "../../../lib/db";

export default async function handler(req, res) {
    try {
        await connectMongo();
    } catch (error) {
        return res
            .status(500)
            .json({ error: "Error in the database connection" });
    }

    const { method } = req;
    res.setHeader("Access-Control-Allow-Origin", "*");

    switch (method) {
        case "GET":
            const id = req.query.id;
            const resource_id = "053cea08-09bc-40ec-8f7a-156f0677aff3";

            if (!id) {
                return res.status(400).json({ error: "No number entered" });
            }

            let config = {
                method: "post",
                maxBodyLength: Infinity,
                url: `https://data.gov.il/api/3/action/datastore_search?resource_id=${resource_id}&q=${id}`,
                headers: {},
                data: "",
            };

            axios
                .request(config)
                .then((response) => {
                    if (response.data.result.records.length > 0) {
                        return res.status(200).json(response.data.result);
                    } else {
                        throw new Error("No Such Car");
                    }
                })
                .catch((error) => {
                    return res.status(500).json({ error: error.message });
                });
            break;
        default:
            res.setHeader("Allow", ["GET"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
