import { Router } from "express";
import scanRoutes from "./scans/scans.routes";
import inventoryRoutes from "./Inventory/inventory.routes";
import picklistsRoutes from "./Picklists/picklists.routes";

const router = Router();

router.use("/scans" , scanRoutes);
router.use("/inventory" , inventoryRoutes);
router.use("/picklist" , picklistsRoutes);

export default router;