require("dotenv").config();
const nodemailer = require("nodemailer");
const key = process.env.KEY;

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "ua5495404@gmail.com",
        pass: "blymsphfkkhinwnq",
    },
});

class Mailer{
    async sendemail(email, code) {
        try {
            const info = await transporter.sendMail({
                from: '"code verification" <ua5495404@gmail.com>',
                to: email,
                subject: "code verification",
                html: `
                <html>
                    <head>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background-color: #f4f4f4;
                                padding: 20px;
                            }
                            .container {
                                width: 100%;
                                max-width: 600px;
                                margin: 0 auto;
                                background-color: #ffffff;
                                border-radius: 8px;
                                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                                padding: 20px;
                            }
                            h2 {
                                text-align: center;
                                color: #333333;
                                font-size: 24px;
                                margin-bottom: 20px;
                            }
                            .code-box {
                                display: flex;
                                justify-content: space-between;
                                flex-wrap: wrap;
                                gap: 10px;
                            }
                            .code {
                                margin: 0% auto;
                                width: 50%;
                                padding: 20px;
                                text-align: center;
                                font-size: 22px;
                                font-weight: bold;
                                background-color: #f0f0f0;
                                border-radius: 8px;
                                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                                color: #333333;
                            }
                            .code:hover {
                                background-color: #d1e7dd;
                                transition: background-color 0.3s;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h2>Hotel Management Verification</h2>
                            <div class="code-box">
                                <div class="code">${code}</div>
                            </div>
                        </div>
                    </body>
                </html>
            `,
            });
        }
        catch (err) {
            return res.status(400).json({ message: `error : ${error}` });
        }
    }

    async  bookingEmail(email, roomData, extraService, totalBill) {
        try {
            const info = await transporter.sendMail({
                from: '"Hotel Booking Confirmation" <ua5495404@gmail.com>',
                to: email,
                subject: "Your Booking Confirmation",
                html: `
                <html>
                    <head>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background-color: #f9f9f9;
                                margin: 0;
                                padding: 0;
                                line-height: 1.6;
                                color: #333333;
                            }
                            .container {
                                max-width: 600px;
                                margin: 30px auto;
                                background-color: #ffffff;
                                border-radius: 8px;
                                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                                overflow: hidden;
                                padding: 20px;
                            }
                            h2 {
                                text-align: center;
                                color: #444444;
                                font-size: 24px;
                                margin-bottom: 20px;
                            }
                            .info {
                                margin-bottom: 20px;
                            }
                            .info p {
                                margin: 5px 0;
                                font-size: 16px;
                            }
                            .details {
                                margin: 20px 0;
                                border: 1px solid #e0e0e0;
                                border-radius: 8px;
                                padding: 15px;
                                background-color: #f4f4f4;
                            }
                            .details h3 {
                                margin: 0 0 10px 0;
                                font-size: 18px;
                                color: #555555;
                            }
                            .details p {
                                margin: 5px 0;
                                font-size: 16px;
                            }
                            .total {
                                text-align: center;
                                margin-top: 20px;
                                font-size: 18px;
                                font-weight: bold;
                                color: #2c3e50;
                            }
                            .footer {
                                text-align: center;
                                margin-top: 30px;
                                font-size: 14px;
                                color: #777777;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h2>Thank You for Booking with Us!</h2>
                            <div class="info">
                                <p>Dear Guest,</p>
                                <p>We are excited to confirm your booking. Below are the details of your reservation:</p>
                            </div>
                            <div class="details">
                                <h3>Booking Details</h3>
                                <p><strong>Room Code:</strong> ${roomData}</p>
                                <p><strong>Extra Services:</strong> ${extraService || "None"}</p>
                            </div>
                            <div class="total">
                                <p>Total Amount: <strong>$${totalBill}</strong></p>
                            </div>
                            <div class="footer">
                                <p>If you have any questions or need to make changes to your booking, feel free to contact us.</p>
                                <p>We look forward to hosting you!</p>
                            </div>
                        </div>
                    </body>
                </html>
                `,
            });
            return info;
        } catch (error) {
            console.error(`Error sending email: ${error.message}`);
            return { success: false, error: error.message };
        }
    }
    
}

module.exports=new Mailer;