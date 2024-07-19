import { protectSupplyBeam } from "../../../../middleware/auth.middleware";
import { basicQrValidation } from "../../../../middleware/scan.middleware";
import { verifyQrCodeAtCheckin } from "../../../controller/scans/checkin.scan.controller";
import { verifyQrCodeAtCheckout } from "../../../controller/scans/checkouts.scan.controller";


const express = require("express");

const router = express.Router();

router.route("/checkout-in").get(protectSupplyBeam, basicQrValidation , verifyQrCodeAtCheckout );
router.route("/checkin-in").get(protectSupplyBeam, basicQrValidation , verifyQrCodeAtCheckin );


export default router;