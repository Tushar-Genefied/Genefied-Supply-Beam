import { protectSupplyBeam } from "../../../../middleware/auth.middleware";
import { basicQrValidation } from "../../../../middleware/scan.middleware";
import { verifyQrCodeAtCheckin } from "../../../controller/scans/checkin.scan.controller";
import { verifyQrCodeAtCheckout } from "../../../controller/scans/checkouts.scan.controller";
import { verifyQrCodeForPickList } from "../../../controller/scans/picklist.scan.controller";


const express = require("express");

const router = express.Router();
router.route("/checkout").post(protectSupplyBeam, basicQrValidation , verifyQrCodeAtCheckout );
router.route("/checkin").post(protectSupplyBeam, basicQrValidation , verifyQrCodeAtCheckin );
router.route("/picklist").post(protectSupplyBeam, basicQrValidation , verifyQrCodeForPickList );

export default router;