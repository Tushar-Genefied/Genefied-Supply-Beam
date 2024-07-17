import { protectSupplyBeam } from "../../../../middleware/auth.middleware";
import { basicQrValidation } from "../../../../middleware/scan.middleware";
import { verifyQrCodeAtCheckout } from "../../../controller/scans/checkouts.scan.controller";


const express = require("express");

const router = express.Router();

router.route("/checkout-in").get(protectSupplyBeam, basicQrValidation , verifyQrCodeAtCheckout );


export default router;