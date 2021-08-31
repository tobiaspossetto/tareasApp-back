const { Router } = require('express');
const router = Router();
const { body } = require('express-validator');
const { checkJwt } = require('../libs/jwt')
const { signUp, signIn,changePassword } = require('../controllers/userController')
//
router.route('/sign-up')
    .post(
        body('username', 'Username incompleto')
            .exists()
            .isLength({ min: 6, max: 20 }),
        body('email', 'Invalid Email')
            .exists()
            .isEmail(),
        body('password', 'Password incompleto')
            .exists()
            .isLength({ min: 6 }),
       
        signUp
    )

router.route('/sign-in')
    .post(
        body('username', 'Username incompleto')
            .exists(),
            

        body('password', 'Password incompleto')
            .exists(),
            

        signIn
    )

router.route('/change-password')
    .post(checkJwt,
        body('oldPassword', 'Contraseña vieja requerida')
            .exists(),
            
        body('newPassword', 'Nueva contraseña requerida')
            .exists()
            .isLength({ min: 6 }),
        body('confirmNewPassword', 'Las contraseñas no coinciden')
            .exists()
            .isLength({ min: 6 }),

        changePassword
    )
module.exports = router;