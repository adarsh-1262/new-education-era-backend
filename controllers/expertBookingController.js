const ConsultationBooking = require("../models/ConsultationBooking");
const sendEmail = require("../utils/sendingEmail");


const bookExpert = async(req, res) => {
    try {
        console.log("req ",req.user.email)
        const {expertName, Expertemail, field, time, date} = req.body;
        if(!expertName || !Expertemail || !field || !time || !date) {
            return res.status(404).json({
                success: false,
                message: "Please provide all details",
            })
        }
        console.log("date ",date)
        console.log("time ",time)
        const userEmail = req.user.email;
        const userName = req.user.username;

        const studentMessage = 
        `Dear ${userName},

        Thank you for booking with us! Here are the details of your appointment:

        Expert Name: ${expertName}
        Date: ${date}
        Time: ${time}

        We look forward to serving you!

        Best regards,  
        EduHub`;

        const expertMessage = 
        `Dear ${expertName},

        You have a new booking! Here are the details:

        Student Name: ${userName}
        Student Email: ${userEmail}
        Date: ${date}
        Time: ${time}

        Please prepare for your session accordingly.

        Best regards,  
        EduHub`;

        const booked = await ConsultationBooking.findOne({ $or: [{ date }, { time }] })
        if(booked) {
            return res.status(404).json({
                success: false,
                message: `Expert is already booked on this ${date} & ${time}`,
            })
        }
        
        const booking = await ConsultationBooking.create({
            username : userName,
            email: userEmail,
            field: field,
            date,
            time
        });
        if(!booking) {
            return res.status(404).json({
                success: false,
                message: "Something went wrong",
            })
        }

        console.log("sending email")
        try {
            const sendToStudent = await sendEmail(userEmail, studentMessage);
            const sendToExpert = await sendEmail(Expertemail, expertMessage);
        } catch (error) {
            console.log("error while sending emails ",error)
        }

        return res.status(201).json({
            success: true,
            message: `Booking confirmed on ${date}, ${time}`,
        })

    } catch (error) {
        console.log("error while booking expert ",error)
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
        })
    }
}

module.exports = {bookExpert}