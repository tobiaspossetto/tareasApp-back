const { Router } = require('express');
const router = Router();
const { body } = require('express-validator');
const { checkJwt } = require('../libs/jwt')
const { signUp, signIn,changePassword } = require('../controllers/userController')
//
router.route('/sign-up')
    .post(
        body('username', 'Username incomplete')
            .exists()
            .isLength({ min: 6, max: 20 }),
        body('email', 'Invalid Email')
            .exists()
            .isEmail(),
        body('password', 'Password incomplete')
            .exists()
            .isLength({ min: 6 }),
        body('passwordConfirm', 'PasswordConfirm incomplete')
            .exists()
            .isLength({ min: 6 }),
        signUp
    )

router.route('/sign-in')
    .post(
        body('username', 'Username incomplete')
            .exists()
            .isLength({ min: 6, max: 20 }),

        body('password', 'Password incomplete')
            .exists()
            .isLength({ min: 6 }),

        signIn
    )

router.route('/change-password')
    .post(checkJwt,
        body('oldPassword', 'old password value are required')
            .exists()
            .isLength({ min: 6 }),
        body('newPassword', 'new password value are required')
            .exists()
            .isLength({ min: 6 }),
        body('confirmNewPassword', 'confirm password incorrect')
            .exists()
            .isLength({ min: 6 }),

        changePassword
    )
module.exports = router;