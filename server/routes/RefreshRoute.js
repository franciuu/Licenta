import express from "express"
import {handleRefreshToken} from "../controllers/RefreshToken.js"

const router = express.Router();

router.get('/refresh', handleRefreshToken);

export default router;