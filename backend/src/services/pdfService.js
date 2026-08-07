const PDFDocument = require("pdfkit");

exports.generatePassPdf = async(pass,res)=>{
    const doc = new PDFDocument({
        size:"A4",
        margin:50
    });

    res.setHeader("Content-Type","application/pdf");

    res.setHeader(
        "Content-Disposition",
        `attchement; filename=${pass.passNumber}.pdf`
    );

    doc.pipe(res);


    doc
         .fontSize(25)
         .text("Visitor Pass",{align:"center"});


         doc.moveDown();


         doc.fontSize(15).text(`Pass Number:${pass.passNumber}`);
         doc.text(`Visitor:${pass.visitor.fullName}`);
         doc.text(`Email:${pass.visitor.email}`);
         doc.text(`Phone:${pass.visitor.phone}`);


         doc.moveDown();

         doc.text(`Purpose:${pass.appointment.purpose}`);
         doc.text(
            `Visit Date: ${new Date(
                pass.appointment.visitDate
            ).toLocaleString()} `
         );

         doc.text(
            `Expiry:${new Date(pass.expiryAt).toLocaleString()}`
         );

         doc.moveDown();


         //QR Code

         if(pass.qrCode){
            const base64 = pass.qrCode.replace(
                /^data:image\/png;base64,/,
                ""
            );

            const buffer = Buffer.from(base64,"base64");

             doc.image(buffer,{
                fit:[180,180],
                align:'center'
             });
         }

         doc.moveDown();
         

         doc
            .fontSize(12)
            .fillColor("green")
            .text("Verified Visitor Pass",{
                align:"center"
            });

            doc.end()
            

};