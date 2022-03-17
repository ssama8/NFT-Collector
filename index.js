import express from "express";
import bodyParser from "body-parser";
import usersRoutes from "./routes/users.js";
import cors from "cors";

const app = express();
const port = process.env.PORT || 5000;
app.use(
	cors({
		origin: "*",
	})
);
app.use(bodyParser.json());
app.use(express.static("public"));
app.use("/users", usersRoutes);
app.get("/", (req, res) => {
	console.log("Visited");
	res.send("hello from homepage");
});

app.listen(port, () => {
	console.log(`Server running on port: http://localhost:${port}/`);
});
