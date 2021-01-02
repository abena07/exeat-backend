const Student = require('../models/student')
const studentRouter =require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../helpers/config')






//to register a student
studentRouter.post('/signup',function(request,response){
    const studentID = request.body.studentID
    const password = request.body.password
    const email = request.body.email
    const firstname=request.body.firstname
    const lastname =request.body.lastname
    const confirmpswd=request.body.confirmpswd
    
    const newStudent = new Student({
        firstname:firstname,
        lastname:lastname,
        studentID: studentID,
        email: email,
        password: password,
        confirmpswd:confirmpswd,
        
        

    })
    
    newStudent.save(function(err, savedStudent){
        if(err){
            console.log(err)
            return response.status(500).send()
        }
        console.log(savedStudent)
        return response.status(200).send()
    })
})

/**
 * Logging User
 * ------------
 * 1. Get user details
 * 2. Find if the user exist
 * 3. Hash the user's password and compare against password stored in the db
 * 4. Generate a token using either user ID or email ==> return random token
 * 5. if user exist, we set an http-only cookie and return {message: "Login success", {userDetails}}
 * 5. if user does not exist, we send {error: "Invalid user or password"}
 * 
 * Login is purposely for (authentication and authorization)
 * Authentication ==> Verifying that the user exists in the system
 * Authorization ==> Verifying that the user has the enough permission to perform which ever operation
 */


/// to log a student in
studentRouter.post('/login',function(request,response,next){
    const studentID = request.body.studentID
    const password = request.body.password
    const email =request.body.email

    Student.findOne({ studentID: studentID, password: password, email: email}, function(err,student){
        if(err){
            console.log(err)
            return response.staus(500).send()
        }
        if(!student){
            return response.status(404).send()
        }

        return response.status(200).send('good')
    })
}
)

// Login User
studentRouter.post("/signin", async (request, response)  => {
    const {studentID, email, password} = request.body
    await Student.findOne({studentID: studentID, email: email}).exec((error, student) => {
        if (error) {
            response.status(500).send({error: "Internal Server Error"})
        }

        if (!student) {
            response.status(401).send({error: "Invalid Credentials"})
        }

        // TODO: Compare Hashed password and set some cookies
        // generate a token using jsonwebtoken {email} or {id}

        try {
            const valid = bcrypt.compareSync(password, student.password)
            if (!valid) {
                response.status(401).send({error: "Invalid Password"})
            }

            // Set a cookie and send a response
            const payload = {email: email, studentID: studentID}
            const token = jwt.sign(payload, config.JWT_SECRET)
            response.cookie("Authorization", `Bearer ${token}`, {httpOnly: true, maxAge: 86_400_000})

            response.send(student)

        } catch (excpetion) {
            console.log(exception)
            response.status(500).send({error: "Internal Server Error"})
        }

    })
})


//get a student by id
studentRouter.get('/:studentID', (request, response) => {
    let student= Student.find(student => student["studentID"] === request.params.studentID)
        if(student){
            response.status(200).send(student)
        } else{
            response.status(400).send('A student with that id was not found')
        }
    })
    


    //get a student by a specific email
    studentRouter.get('/:email', (request, response) => {
        let student= Student.find(student => student["email"] === request.params.email)
            if(student){
                response.status(200).send(student)
            } else{
                response.status(400).send('A student with that email was not found')
            }
        })
        
    

module.exports = studentRouter