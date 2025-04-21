const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
   
}

module.exports = Auth;
