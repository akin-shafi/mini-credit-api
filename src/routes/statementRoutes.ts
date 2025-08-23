import { Router } from "express";
import * as statementController from "../controllers/statementController";
import { authenticateJWT, authorizeRoles } from "../middleware/authMiddleware";
import multer from "multer";

const upload = multer({ dest: "uploads/" });
const router = Router();

/**
 * @swagger
 * /statements/upload:
 *   post:
 *     summary: Upload a bank statement
 *     tags: [Statements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Statement uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Statement'
 *             examples:
 *               StatementExample:
 *                 $ref: '#/components/examples/StatementExample'
 */
router.post(
  "/upload",
  authenticateJWT,
  authorizeRoles("admin", "user"),
  upload.single("file"),
  statementController.uploadStatement
);

export default router;
