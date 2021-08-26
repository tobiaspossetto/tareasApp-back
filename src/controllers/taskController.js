
const { validationResult } = require('express-validator')
const pool = require('../libs/db-connection')





const taskController = {}
taskController.createTask = async (req, res) => {
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
        const {title,description} = req.body
        const { userId } = res.locals.jwtPayload;
       const  newTask = {
            title,description,userId
        }
        try {
            await pool.query('insert into tasks set ?',[newTask])
            res.send('Task Created')
        } catch (error) {
            console.log(error)
        }
        
         
     }
}

taskController.getTask = async (req, res) => {
    const { userId } = res.locals.jwtPayload;
    let tasks = await pool.query('select tasks.id ,title,description, tasks.createdAt from tasks  INNER JOIN users ON tasks.userId = users.id WHERE userId = ?', [userId])
    tasks.forEach(row => {
        row.createdAt = row.createdAt.toLocaleDateString()
    })
    res.status(200).json(tasks)
}

taskController.editTask = async (req, res) => {
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
        const {title,description} = req.body
        const {id} = req.params

        let exist = await pool.query('select title from tasks where id = ?', [id])
        if(exist.length > 0) {
            const editTask = {
                title,description
            }
            await pool.query('UPDATE  tasks SET ? where id = ?', [editTask,id])
            res.send('updated')
        }else{
            res.status(400).json({ error: 'Task not found' })
        }
    }
}

taskController.deleteTask = async (req, res) => {

    const{id} = req.params
    let exist = await pool.query('select title from tasks where id = ?', [id])
    if(exist.length > 0) {
        await pool.query('delete from tasks where id = ?', [id])
        res.send('deleted')
    }else{
        res.status(400).json({ error: 'Task not found' })
    }
    
}

module.exports = taskController