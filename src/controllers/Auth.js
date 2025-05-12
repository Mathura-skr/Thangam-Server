const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { validateUser } = require('../schemas/user');

class Auth {


   constructor(userModel) {
      this.userModel = userModel;
   }

   signin = async (req, res) => {
      const { email, password } = req.body;

      try {
         // ✅ Fetch user by email
         const existingUser = await this.userModel.getByEmail(email);

         if (!existingUser) {
            return res.status(404).json({ message: 'User does not exist' });
         }

         // ✅ Check password
         const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

         if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Invalid password' });
         }

         // ✅ Generate JWT token
         const token = jwt.sign(
            { email: existingUser.email, userId: existingUser.id, role: existingUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
         );

         // ✅ Respond with user details (excluding password)
         res.status(200).json({
            result: {
               userId: existingUser.id,
               name: existingUser.name,
               email: existingUser.email,
               phone: existingUser.phone,
               image_url: existingUser.image_url,
               role: existingUser.role,
               isAdmin: existingUser.isAdmin,
            },
            token,
         });
      } catch (error) {
         console.error('❌ Signin Error:', error);
         res.status(500).json({ message: 'Something went wrong' });
      }
   };

   signup = async (req, res) => {
      const validatedResult = validateUser(req.body);
   
      if (!validatedResult.success) {
         return res.status(400).json({
            message: validatedResult.error?.errors || "Validation failed",
         });
      }
   
      const { data } = validatedResult;
   
      try {
         const existingUser = await this.userModel.getByEmail(data.email);
   
         if (existingUser) {
            return res.status(409).json({
               message: 'A user with that email already exists',
            });
         }
   
         data.password = await bcrypt.hash(data.password, 12);
   
         const allowedRoles = ['user', 'admin', 'staff'];
         const finalRole = data.role && allowedRoles.includes(data.role) ? data.role : 'user';
         const isAdmin = data.role === 'admin'; // Only make admin if role is explicitly 'admin'
         
         const newUser = await this.userModel.create({
            name: data.name,
            email: data.email,
            password: data.password,
            phone: data.phone,
            isAdmin,
            role: finalRole,
         });
         
   
         const token = jwt.sign(
            { email: newUser.email, userId: newUser.id },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
         );
   
         delete newUser.password;
         console.log('User Created:', newUser);
   
         res.status(201).json({
            result: { ...newUser },
            token,
            message: 'User Created Successfully',
         });
      } catch (error) {
         console.error('Signup Error:', error);
         res.status(500).json({ message: 'Something went wrong' });
      }
   };
   
   forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
      const user = await this.userModel.getByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate secure token
      const token = crypto.randomBytes(32).toString("hex");
      const tokenExpiry = Date.now() + 3600000; // 1 hour

      // Save token to DB
      await this.userModel.saveResetToken(user.id, token, tokenExpiry);

      // Create reset link
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

      // Send email
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Support" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "Password Reset Request",
        html: `<p>Hi ${user.name},</p><p>Click <a href="${resetLink}">here</a> to reset your password. This link is valid for 1 hour.</p>`,
      });

      res.json({ message: "Reset link sent to your email." });
    } catch (error) {
      console.error("Forgot Password Error:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  };

  // ✅ 2. Reset Password
  resetPassword = async (req, res) => {
    const { token, password } = req.body;

    try {
      const user = await this.userModel.getByResetToken(token);
      if (!user || user.resetTokenExpiry < Date.now()) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      await this.userModel.updatePassword(user.id, hashedPassword);

      // Clear reset token
      await this.userModel.clearResetToken(user.id);

      res.json({ message: "Password has been reset successfully" });
    } catch (error) {
      console.error("Reset Password Error:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  };

}

module.exports = Auth;
