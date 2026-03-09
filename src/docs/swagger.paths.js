/**
 * @openapi
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: API and database health status
 *     responses:
 *       200:
 *         description: API is running
 */

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegisterInput'
 *     responses:
 *       201:
 *         description: User registered
 */

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login and receive JWT token
 *     responses:
 *       200:
 *         description: Login successful
 */

/**
 * @openapi
 * /clients:
 *   get:
 *     tags: [Clients]
 *     summary: List clients
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of clients
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *   post:
 *     tags: [Clients]
 *     summary: Create a client
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClientInput'
 *     responses:
 *       201:
 *         description: Client created
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @openapi
 * /invoices:
 *   get:
 *     tags: [Invoices]
 *     summary: List invoices
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List invoices
 *   post:
 *     tags: [Invoices]
 *     summary: Create invoice
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Invoice created
 */

/**
 * @openapi
 * /payments:
 *   post:
 *     tags: [Payments]
 *     summary: Record manual payment
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Payment recorded
 */

/**
 * @openapi
 * /recovery-actions:
 *   get:
 *     tags: [RecoveryActions]
 *     summary: List recovery actions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List recovery actions
 *   post:
 *     tags: [RecoveryActions]
 *     summary: Create recovery action
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Recovery action created
 */

/**
 * @openapi
 * /stats/overview:
 *   get:
 *     tags: [Stats]
 *     summary: Global statistics overview
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Overview stats
 */

/**
 * @openapi
 * /stats/invoices:
 *   get:
 *     tags: [Stats]
 *     summary: Invoice statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Invoice stats
 */

/**
 * @openapi
 * /stats/agents:
 *   get:
 *     tags: [Stats]
 *     summary: Agent activity statistics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Agent stats
 */
