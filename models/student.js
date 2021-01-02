
const mongoose =require('mongoose')
const bcrypt = require("bcrypt")


const studentSchema=new mongoose.Schema({
    firstname:{
        type: String,
        required: true


    },
    lastname:{
        type: String,
        required: true

    },
    studentID:{
        type:Number,
        required:true,

    },
    
    email:{
        
        type: String,
        required: true,
        unique: true

    },
    password:{
        type:String,
        required:true,

    },


    confirmpswd:{
        type:String,
        required:true,
    },

    

    



    // lastLogin:{
    //     type:Date

    // },

    // active:{}

})

/// Query user: _id: 9485840ajkdsjkasdf
/// id
// __v
// password


studentSchema.set("toJSON", {
    transform: (doc, student)=> {
        student.id = student._id.toString()
        delete student._id
        delete student.__v
        delete student.password
    }
})


// Hash password before saving 
studentSchema.pre("save", function(next){
    const student = this;

    // Hash password if and only if student is new or password is being modified
    if (!student.isModified('password')) {
        next()
    }

    // Generate a hash salt
    bcrypt.genSalt(10, (error, hash) => {
        if (!error) next(error)

        // Override the password with the generated hash
        student.password = hash
    })
    
})



// Adding comparePassword method to the schema
studentSchema.methods.comparePassword = (password, callback) => {
    bcrypt.compare(password, this.password, (error, isMatch) => {
        if (error) {
            callback(error)
        }
        callback(null, isMatch)
    })
}


module.exports=mongoose.model("Student",studentSchema)
