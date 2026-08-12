const nodemailer = require("nodemailer");

console.log("EMAIL SERVICE LOADED:", __filename);

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error("SMTP ERROR:", error);
    } else {
        console.log("SMTP SERVER READY");
    }
});

const sendPassEmail = async (pass, pdfBuffer) => {
    try {

        console.log("EMAIL USER:", process.env.EMAIL_USER);
        console.log("PASSWORD EXISTS:", !!process.env.EMAIL_PASS);
        console.log("VISITOR EMAIL:", pass?.visitor?.email);
        console.log("PDF BUFFER:", pdfBuffer?.length);

        const mailOptions = {
            from: process.env.EMAIL_USER,

            to: pass.visitor.email,

            subject: `Your Visitor Pass - ${pass.passNumber}`,

            html: `
                <h2>Visitor Pass Generated</h2>

                <p>
                    Dear ${pass.visitor.fullName},
                </p>

                <p>
                    Your visitor pass has been successfully generated.
                </p>

                <h3>Visit Details</h3>

                <p>
                    <strong>Pass Number:</strong>
                    ${pass.passNumber}
                </p>

                <p>
                    <strong>Purpose:</strong>
                    ${pass.appointment.purpose}
                </p>

                <p>
                    <strong>Visit Date:</strong>
                    ${new Date(
                        pass.appointment.visitDate
                    ).toLocaleString()}
                </p>

                <p>
                    <strong>Expiry:</strong>
                    ${new Date(
                        pass.expiryAt
                    ).toLocaleString()}
                </p>

                <p>
                    Your Visitor Pass PDF is attached to this email.
                    Please show the QR code at the security desk
                    during check-in.
                </p>
            `,

            attachments: [
                {
                    filename: `${pass.passNumber}.pdf`,
                    content: pdfBuffer,
                    contentType: "application/pdf"
                }
            ]
        };

        const info = await transporter.sendMail(mailOptions);

        console.log("EMAIL SENT:", info.messageId);

        return info;

    } catch (error) {

        console.error("========== REAL EMAIL ERROR ==========");
        console.error("Message:", error.message);
        console.error("Code:", error.code);
        console.error("Command:", error.command);
        console.error("Response:", error.response);
        console.error("Response Code:", error.responseCode);
        console.error("======================================");

        throw error;
    }
};

module.exports = {
    sendPassEmail
};