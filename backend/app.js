import express from "express";
import cors from "cors";
import newApp from "./newApp.js";

const app = express();

app.use(cors());
app.use(express.json())

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/api/newapp", newApp);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});