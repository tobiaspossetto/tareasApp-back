
const { validationResult } = require('express-validator')
const pool = require('../libs/db-connection')

const {hashPassword,checkPassword} = require('../libs/encryptor')
const jwt = require('jsonwebtoken')


const userController = {}
userController.signUp = async (req, res) => {
     //Valida los campos con express-validator

     const errors = validationResult(req)
     if (!errors.isEmpty()) {
         //si hay errores
 
         //Me quedo solo con los mensajes para mas seguridad
         let arrayErrosms = errors.array()
         let arrayMsg = []
 
         arrayErrosms.forEach(e => {
             arrayMsg.push(e.msg)
         });
         //utilizo solo el mensaje y lo envio
         res.status(400).json({ error: arrayMsg })
 
     } else {
         const{username, email, password, passwordConfirm} = req.body
         if(password !== passwordConfirm){
             res.status(400).send('Password and passwordConfirm do not match')
         }else{
            let rows = await pool.query('select username from users where username = ? or email = ?', [username,email])
             if(rows.length > 0){
                res.status(400).send('username or email already in use')
             }else{
                 let encripted = hashPassword(password)
                 const newUser = {
                     username, email,password:encripted
                 }

                 await pool.query('insert into users set  ?', [newUser])
                 return res.send('created')
             }
             
            
         }
      
     }
}

userController.signIn = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        //si hay errores

        //Me quedo solo con los mensajes para mas seguridad
        let arrayErrosms = errors.array()
        let arrayMsg = []

        arrayErrosms.forEach(e => {
            arrayMsg.push(e.msg)
        });
        //utilizo solo el mensaje y lo envio
        res.status(400).json({ error: arrayMsg })

    } else {
        const {username, password} = req.body

        let userExist = await pool.query('Select id,username,email from users where username = ?', [username])
        if(userExist.length > 0) {
            let verify = await checkPassword(password,username)
            if(verify) {
                try {
                    //Envio un token creado para el usuario
                    //Libreria JWT, el token expira en 2h para mayor seguridad
                    jwt.sign({ userId: userExist[0].id, username: userExist[0].username, email: userExist[0].email }, 'secreto', { expiresIn: '2h' }, (err, token) => {
                        res.json({ token, "id": userExist[0].id })
                    })


                } catch (error) {
                    console.log(error)
                }
            }else{
                res.status(400).json({ error: 'password incorrect' })
            }

        }else{
            res.status(400).json({ error: 'username not found' })
        }
    }
}

userController.changePassword = async (req, res) => {
     //Como se accede si esta autenticado traigo el id almacenado al iniciar sesión
     const { userId } = res.locals.jwtPayload;
     //Traigo los campos
     const { oldPassword, newPassword, confirmNewPassword } = req.body;
      //----- Verifico errores con express-validator
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        //si hay errores
        let arrayErrosms = errors.array()
        let arrayMsg = []

        arrayErrosms.forEach(e => {
            arrayMsg.push(e.msg)
        });
        //utilizo solo el mensaje y lo envio
        res.status(400).json({ error: arrayMsg })


    } else if (newPassword !== confirmNewPassword) {
        //Si los 2 campos no coinciden
        res.status(400).json({ error: "password confirm not coincide" })
    } else {
        //Intenta hacer el llamado a la db buscando por id
        try {
            let rows = await pool.query("SELECT username FROM users WHERE id = ?", [userId])
            //traigo el username de la db con el id almacenado, para mas seguridad
            //verifico la contraseña vieja con su cuenta
            let verify = await checkPassword(oldPassword, rows[0].username)
            if (!verify) {
                res.status(400).json({ error: "old password incorrect" })
            } else {
                //Funcion donde paso la contraseña nueva para cifrarla
                let finalPassword = hashPassword(newPassword)
                //guarda el nuevo texto cifrado en la db, actualizando la anterior
                await pool.query("UPDATE users SET password = ? WHERE id = ?", [finalPassword, userId])
                res.send('password changed')
            }
            //Si el llamado no funciona mando un mensaje de error
        } catch (error) {
            console.log(error)
            res.status(404).json({ message: 'Something goes wrong!' })
        }


    }
}

module.exports = userController