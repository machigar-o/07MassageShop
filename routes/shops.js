/**
* @swagger
* components:
*   schemas:
*     Shop:
*       type: object
*       required:
*         - name
*         - address
*         - priceLevel
*         - province
*         - postalcode
*         - picture
*       properties:
*         name:
*           type: string
*           description: Name of the shop
*         address:
*           type: string
*           description: House No., Street, Road
*         priceLevel:
*           type: number
*           description: Level of price from 1 to 4 (default is 3)
*         province:
*           type: string
*           description: province
*         postalcode:
*           type: string
*           description: 5-digit postal code 
*         tel:
*           type: string
*           description: telephone number
*         picture:
*           type: string
*           description: picture
*/

const express = require("express");
const {
  getShops,
  getShop,
  createShop,
  updateShop,
  deleteShop,
} = require("../controllers/shops");

/**
* @swagger
* tags:
*   name: Shops
*   description: The shops managing API
*/

// Include other resource routers
const bookingRouter = require("./bookings");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");

// Re-route into other resource routers

/**
* @swagger
* /shops:
*   post:
*     security:
*       - bearerAuth: []
*     summary: Create a new shop
*     tags: [Shops]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Shop'
*     responses:
*       201:
*         description: The shop was successfully created
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Shop'
*       500:
*         description: Some server error
*/

/**
* @swagger
* /shops:
*   get:
*     summary: Returns the list of all the shops
*     tags: [Shops]
*     responses:
*       200:
*         description: The list of the shops
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*               $ref: '#/components/schemas/Shop'
*/
router.use("/:shopId/bookings", bookingRouter);
router
  .route("/")
  .get(getShops)
  .post(protect, authorize("admin"), createShop);

/**
* @swagger
* /shops/{id}:
*   get:
*     summary: Get the shop by id
*     tags: [Shops]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The shop id
*     responses:
*       200:
*         description: The shop description by id
*         contents:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Shop'
*       404:
*         description: The shop was not found
*/

/**
* @swagger
* /shops/{id}:
*   put:
*     security:
*       - bearerAuth: []
*     summary: Update the shop by id
*     tags: [Shops]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The shop id
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/Shop'
*     responses:
*       200:
*         description: The shop was successfully updated
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Shop'
*       500:
*         description: Some server error
*/

/**
* @swagger
* /shops/{id}:
*   delete:
*     security:
*       - bearerAuth: []
*     summary: Delete the shop by id
*     tags: [Shops]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The shop id
*     responses:
*       200:
*         description: The shop was successfully deleted
*         contents:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/Shop'
*       404:
*         description: The shop was not found
*/
router
  .route("/:id")
  .get(getShop)
  .put(protect, authorize("admin"), updateShop)
  .delete(protect, authorize("admin"), deleteShop);

module.exports = router;
