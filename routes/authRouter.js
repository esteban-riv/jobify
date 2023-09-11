import { Router } from 'express';
import { register, login, logout } from '../controllers/authController.js';
import { validateLoginInput, validateRegisterInput } from '../middleware/validationMiddleware.js';
import rateLimiter from 'express-rate-limit';

const router = Router();

const apiLimiter = rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10000,
    message: { message: 'Too many accounts created from this IP, please try again after an hour'}
});

router.post('/register', apiLimiter, validateRegisterInput, register);
router.post('/login', apiLimiter, validateLoginInput, login);
router.get('/logout', logout);

export default router;