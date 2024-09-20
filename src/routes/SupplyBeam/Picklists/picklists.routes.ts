

import { protectSupplyBeam } from "../../../../middleware/auth.middleware";
import { getPicklistItemsDetails } from "../../../controller/picklist/picklist";

const express = require("express");

const router = express.Router();
router.route("/:order_no").get(protectSupplyBeam, getPicklistItemsDetails );

export default router;