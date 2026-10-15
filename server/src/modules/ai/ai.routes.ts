import { Router } from "express";
import { aiStoreController } from "./ai.controller.js";
import { requireAuth } from "../../middleware/auth.js";

const router = Router();

// Protect all AI Store Generator routes with user authentication
router.use(requireAuth);

router.post("/generate", (req, res, next) => aiStoreController.generateStore(req, res, next));
router.post("/modify", (req, res, next) => aiStoreController.modifyStore(req, res, next));
router.post("/save", (req, res, next) => aiStoreController.saveOrPublish(req, res, next));

export default router;
