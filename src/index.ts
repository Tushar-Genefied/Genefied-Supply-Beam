import { serverConfig } from "./config/enviroment";
import { connectAllDb } from "./utils/connectionManager";
import SupplyBeamRoutes from "./routes/SupplyBeam";

const express = require ("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const port = serverConfig.port;
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/supply-beam", SupplyBeamRoutes);

app.listen(port, async () => {
    console.log("server config",serverConfig);
    console.log("connectAllDb");
    if(serverConfig.mode === "PROD"  ){
        console.info(`Production Mode Started on PORT : ${port} `);
    }else if ( serverConfig.mode === "DEV"){
        console.info(`Development Mode Started on PORT : ${port} `);
    }else{
        console.info(`Testing Mode Started on PORT : ${port} `);
    }
});
