var nodemailer = require('nodemailer');

exports.Send = function (subject, to, bodyHtml) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'shubhalearngurukul@gmail.com',
            pass: 'GodIsLove'
        }
    });

    var mailOptions = {
        from: 'shubhalearngurukul@gmail.com',
        to: to,
        cc: ['mshubha123@gmail.com'],
        subject: subject,
        html: bodyHtml
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};