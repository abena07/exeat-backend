const Booking = require('../models/booking')
const bookingRouter = require('express').Router()


///create a booking
bookingRouter.post('/create', async function (request, response) {

    const studentID = request.body.studentID
    const goingDate = request.body.goingDate
    const returnDate = request.body.returnDate
    const reason = request.body.reason

    const newBooking = new Booking({
        studentID: studentID,
        goingDate: goingDate,
        returnDate: returnDate,
        reason: reason
    })

    newBooking.save(function (err, savedBooking) {
        
        if (err) {
            console.log(">>>>>>>>>> working")
            console.log(err)
            response.status(400).json({ msg: "something failed" })
            return;
        }

        console.log(savedBooking)
        response.status(200).json({ msg: "Success", data: savedBooking })
    })

})



module.exports = bookingRouter