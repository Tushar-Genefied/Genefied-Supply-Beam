import { protectSupplyBeam } from "../../../../middleware/auth.middleware";
import { checkinInventory } from "../../../controller/inventory/checkin.inventory.controller";
import { checkoutInventory } from "../../../controller/inventory/checkouts.inventory.controller";
import { invoiceCheckoutInventory } from "../../../controller/inventory/invoiceCheckouts.inventory.controller";
import { picklistInventory } from "../../../controller/inventory/picklist.inventory.controller";
import { picklistCheckoutInventory } from "../../../controller/inventory/picklistCheckouts.inventory.controller";

const express = require("express");

const router = express.Router();
router.route("/checkout").post(protectSupplyBeam , checkoutInventory );
router.route("/checkin").post(protectSupplyBeam , checkinInventory );
router.route("/picklist").post(protectSupplyBeam , picklistInventory );
router.route("/pk-checkout").post(protectSupplyBeam , picklistCheckoutInventory );
router.route("/in-checkout").post(protectSupplyBeam , invoiceCheckoutInventory );

export default router;