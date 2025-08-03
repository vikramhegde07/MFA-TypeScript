import express from 'express';
import { disableMfaHandler, refreshUser, registerUser, setupMfaHandler, userLogin, verifyMFA, verifyMfaSetupHandler, verifyPassword } from '../controller/userController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

//Base route in the router
router.get('/', async (req, res) => {
    try {
        return res.status(200).json('Hello from Router');
    } catch (err) {
        console.log('Server error : ' + err.message);
        res.status(500).send({ message: err.message });
    }
});

//Route to register
router.post('/register', registerUser);

router.post('/login', userLogin);

router.post('/verify-mfa', verifyToken, verifyMFA);

router.post('/verify-password', verifyToken, verifyPassword);

router.get('/setup-mfa', verifyToken, setupMfaHandler);

router.post('/verify-mfa-setup', verifyToken, verifyMfaSetupHandler);

router.post('/disable-mfa', verifyToken, disableMfaHandler)

router.get('/refresh-user', verifyToken, refreshUser);

export default router;