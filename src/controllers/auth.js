import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validateUser } from '../schemas/user.js';

export class AuthController {
   #userModel = null;
   constructor(userModel) {
      this.#userModel = userModel;
   }

   signin = async (req, res) => {
      const { email, password } = req.body;

      try {
         const existingUser = await this.#userModel.getByEmail(email);

         if (!existingUser) {
            return res.status(404).json({ message: 'User does not exist' });
         }

         const isPasswordCorrect = await bcrypt.compare(
            password,
            existingUser.password
         );

         if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Invalid password' });
         }

         const token = jwt.sign(
            { email: existingUser.email, userId: existingUser.user_id },
            process.env.EXPRESS_SECRET_KEY,
            { expiresIn: '1d' }
         );

         res.status(200).json({
            result: {
               userId: existingUser.user_id,
               name: existingUser.name,
               email: existingUser.email,
               isAdmin: existingUser.is_admin,
            },
            token,
         });
      } catch (error) {
         console.error(' Signin Error:', error);
         res.status(500).json({ message: 'Something went wrong' });
      }
   };

   signup = async (req, res) => {
   
      const validatedResult = validateUser(req.body);
   
      if (!validatedResult.success) {
         return res.status(400).json({
            message: JSON.parse(validatedResult.error.message),
         });
      }
   
      const { data } = validatedResult;
   
   
      try {
         const existingUser = await this.#userModel.getByEmail(data.email);
   
         if (existingUser) {
            return res.status(409).json({
               message: 'A user with that email already exists',
            });
         }
   
         data.password = await bcrypt.hash(data.password, 12);
       
         
         const newUser = await this.#userModel.create({
            name: data.name,
            mobile: data.mobile, 
            address: data.address, 
            email: data.email,
            password: data.password,
            isAdmin: data.isAdmin ?? false, 
         });
       
         

         const token = jwt.sign(
            { email: newUser.email, userId: newUser.user_id },
            process.env.EXPRESS_SECRET_KEY,
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
         console.error(' Signup Error:', error);
         res.status(500).json({ message: 'Something went wrong' });
      }
   };
   
}
