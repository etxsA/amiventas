import e from "express";
import cors from "cors";
import bodyParser from "body-parser";

import "dotenv/config"

// Routes
import dashboardRoutes from './routes/dashboard.routes.js';
import modelRoutes from './routes/model.routes.js';
const app = e();

// Middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(e.static("public"));
app.use(e.json());


// Routes 
app.use(dashboardRoutes);
app.use(modelRoutes)

app.get('/404', (req, res) => {
    res.sendFile('404.html', { root: "public" });
});


// 404 
app.use((req, res) => {
    res.redirect("/404");
});


app.listen(process.env.LISTEN_PORT || 3000, () =>{
    console.log(`Running on port ${process.env.LISTEN_PORT || 3000}`);
})