import { protectSupplyBeam } from "../../../../middleware/auth.middleware";
import { checkinInventory } from "../../../controller/inventory/checkin.inventory.controller";
import { checkoutInventory } from "../../../controller/inventory/checkouts.inventory.controller";

const express = require("express");

const router = express.Router();
router.route("/checkout").post(protectSupplyBeam , checkoutInventory );
router.route("/checkin").post(protectSupplyBeam , checkinInventory );


export default router;