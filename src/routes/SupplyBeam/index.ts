import { Router } from "express";
import scanRoutes from "./scans/scans.routes";
import inventoryRoutes from "./Inventory/inventory.routes";

const router = Router();

router.use("/scans" , scanRoutes);
router.use("/inventory" , inventoryRoutes);

export default router;