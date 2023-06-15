import axios from "axios";
import connectMongo from "../../../lib/db";

export default async function handler(req, res) {
  try {
    await connectMongo();
  } catch (error) {
    return res.status(500).json({ error: "Error in the database connection" });
  }

  const { method } = req;
  res.setHeader("Access-Control-Allow-Origin", "*");

  switch (method) {
    case "GET":
      const id = req.query.id;
      const firstResourceID = "053cea08-09bc-40ec-8f7a-156f0677aff3";
      const secondResourceID = "cd3acc5c-03c3-4c89-9c54-d40f93c0d790";

      if (!id) {
        return res.status(400).json({ error: "No number entered" });
      }

      const firstResourceConfig = {
        method: "post",
        maxBodyLength: Infinity,
        url: `https://data.gov.il/api/3/action/datastore_search?resource_id=${firstResourceID}&q=${id}`,
        headers: {},
        data: "",
      };

      const secondResourceConfig = {
        method: "post",
        maxBodyLength: Infinity,
        url: `https://data.gov.il/api/3/action/datastore_search?resource_id=${secondResourceID}&q=${id}`,
        headers: {},
        data: "",
      };

      axios
        .request(firstResourceConfig)
        .then((response) => {
          if (response.data.result.records.length > 0) {
            return res.status(200).json(response.data.result);
          } else {
            // If no car is found in the first API, check the second resource
            return axios.request(secondResourceConfig);
          }
        })
        .then((response) => {
          if (response.data.result.records.length > 0) {
            return res.status(200).json(response.data.result);
          } else {
            return res.status(200).json("no results");
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
