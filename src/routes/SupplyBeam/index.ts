import { Router } from "express";
import scanRoutes from "./scans/scans.routes";
const router = Router();

router.use("/scans" , scanRoutes);

export default router;