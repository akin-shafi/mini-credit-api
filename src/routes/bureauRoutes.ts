import { Router } from "express";
import * as bureauController from "../controllers/bureauController";
import { authenticateJWT, authorizeRoles } from "../middleware/authMiddleware";

const router = Router();

/**
 * @swagger
 * /bureau/check:
 *   post:
 *     summary: Run bureau check for a user
 *     description: |
 *       Runs a credit bureau check using either the configured external Bureau API (e.g. Zeeh Africa)
 *       or a local mock response if no API is configured.
 *
 *       🔑 Requires **Admin** role.
 *
 *     tags: [Bureau]
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
 *                 description: ID of the user the bureau report belongs to
 *               bvn:
 *                 type: string
 *                 description: Bank Verification Number (required if using real API)
 *             example:
 *               userId: 2
 *               bvn: "12345678901"
 *     responses:
 *       201:
 *         description: Bureau report generated and stored
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BureauReport'
 *             examples:
 *               BureauReportExample:
 *                 $ref: '#/components/examples/BureauReportExample'
 *       400:
 *         description: Missing userId or invalid input
 *       500:
 *         description: Bureau API failed or internal server error
 */
router.post(
  "/check",
  authenticateJWT,
  authorizeRoles("admin"),
  bureauController.checkBureau
);

export default router;
