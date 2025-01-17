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
}

module.exports=new Mailer;