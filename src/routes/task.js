const { Router } = require('express');
const router = Router();
const { body } = require('express-validator');
const {checkJwt} = require('../libs/jwt')
const { createTask, getTask, editTask, deleteTask } = require('../controllers/taskController')

router.route('/')
    .post(checkJwt,
        body('title', 'Username incomplete')
            .exists()
            .isLength({  max: 50 }),
        body('description', 'Invalid Email')
            .exists(),
        createTask
    )

    .get(checkJwt, getTask)



router.route('/:id')
    .patch(checkJwt,
        body('title', 'Username incomplete')
        .exists()
        .isLength({  max: 50 }),
    body('description', 'Invalid Email')
      
        .isLength({  max: 200 }),

        editTask
    )
    .delete(checkJwt, deleteTask)
module.exports = router;