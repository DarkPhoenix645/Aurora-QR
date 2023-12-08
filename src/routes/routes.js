'use strict'
import { Router } from "express"
import functions from "../controllers/userController.js"
const router = new Router();

router.post('/signup', (req, res) => { functions.signup_post(req, res) })
router.get('/verify', (req, res) => { functions.verify(req, res) })

export default router;
