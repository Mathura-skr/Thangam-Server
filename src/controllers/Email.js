const nodemailer = require("nodemailer");
const path = require("path");
const { getBillingAddress } = require("../models/Email");
const fs = require("fs");

exports.sendInvoiceEmail = async (req, res) => {
  const { userId, cartItems, billingAddressId, totalPrice, invoiceEmail, orderId } =
    req.body;

  try {
    const billingAddress = await getBillingAddress(billingAddressId);

    if (!billingAddress) {
      return res.status(404).json({ error: "Billing address not found." });
    }

    const escapeHTML = (str) =>
      String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    const htmlContent = `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 650px; margin: 20px auto; padding: 30px; border: 1px solid #ddd; border-radius: 12px; background-color: #fefefe; color: #333;">
        <div style="position: relative; margin-bottom: 20px;">
  <!-- Logo positioned at top-right -->
  <img 
    src="cid:logo" 
    alt="Thangam Logo" 
    style="position: absolute; top: 0; right: 0; max-height: 40px; object-fit: contain;" 
  />

  <!-- Invoice title -->
  <h2 style="color: #2e7d32; margin: 0;">🧾 Order Invoice</h2>
</div>


        <div style="margin-top: 10px;">
          <p><strong>Invoice Sent To:</strong> ${escapeHTML(invoiceEmail)}</p>
          <p><strong>Billing Address:</strong><br/>
            ${escapeHTML(billingAddress.street)},<br/>
            ${escapeHTML(billingAddress.city)}, ${escapeHTML(
      billingAddress.district
    )}<br/>
            ${escapeHTML(billingAddress.province)}
          </p>
        </div>

        <hr style="margin: 30px 0;" />

        <h3 style="color: #333;">🛒 Items Ordered</h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr style="background-color: #f0f0f0;">
              <th style="padding: 8px; text-align: left; border-bottom: 1px solid #ccc;">Product</th>
              <th style="padding: 8px; text-align: center; border-bottom: 1px solid #ccc;">Quantity</th>
              <th style="padding: 8px; text-align: right; border-bottom: 1px solid #ccc;">Price</th>
              <th style="padding: 8px; text-align: right; border-bottom: 1px solid #ccc;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${cartItems
              .map(
                (item) => `
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;">${escapeHTML(
                    item.name
                  )}</td>
                  <td style="padding: 8px; text-align: center; border-bottom: 1px solid #eee;">${
                    item.unit
                  }</td>
                  <td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">LKR.${parseFloat(
                    item.price
                  ).toFixed(2)}</td>
                  <td style="padding: 8px; text-align: right; border-bottom: 1px solid #eee;">LKR.${(
                    item.unit * item.price
                  ).toFixed(2)}</td>
                </tr>
              `
              )
              .join("")}
          </tbody>
        </table>

        <hr style="margin: 30px 0;" />

        <h3 style="text-align: right; font-size: 1.2em;">Total: <span style="color: #2e7d32;">LKR.${parseFloat(
          totalPrice
        ).toFixed(2)}</span></h3>

        <p style="margin-top: 40px; font-size: 0.95em; color: #555;">
          **Islandwide Delivery Free**
        </p>
        
        <p style="margin-top: 40px; font-size: 0.95em; color: #555;">
          Thank you for shopping with <strong>Thangam</strong>! If you have any questions, feel free to reply to this email.
        </p>
         <p style="font-size: 0.9em; color: #555; margin-top: 10px;">
  <strong>Address:</strong> No:23, Dockyard Road, Trincomalee
</p>
      </div>
    `;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Thangam Team" <${process.env.EMAIL_USER}>`,
      to: invoiceEmail,
      subject: `Your Order Invoice – Order #${orderId}`,
      html: htmlContent,
      attachments: [
        {
          filename: "logo.png",
          path: path.join(__dirname, "../../public/logo1.png"),
          cid: "logo",
        },
      ],
    });

    res.status(200).json({ message: "Invoice email sent successfully." });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ error: "Failed to send invoice email." });
  }
};
