import { Router } from "express";
import * as insightController from "../controllers/insightController";
import { authenticateJWT, authorizeRoles } from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * /insights/run:
 *   post:
 *     summary: Run financial insights for a user
 *     tags: [Insights]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *             example:
 *               userId: 2
 *     responses:
 *       200:
 *         description: Insights generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Insight'
 *             examples:
 *               InsightExample:
 *                 $ref: '#/components/examples/InsightExample'
 */
router.post(
  "/run",
  authenticateJWT,
  authorizeRoles("admin", "user"),
  insightController.runInsights
);

/**
 * @swagger
 * /insights/{id}:
 *   get:
 *     summary: Get insights by ID
 *     tags: [Insights]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Insight ID
 *     responses:
 *       200:
 *         description: Insight details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Insight'
 *             examples:
 *               InsightExample:
 *                 $ref: '#/components/examples/InsightExample'
 */
router.get(
  "/:id",
  authenticateJWT,
  authorizeRoles("admin", "user"),
  insightController.getInsights
);

export default router;
