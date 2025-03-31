import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export class Auth {
  constructor(userModel) {
    this.userModel = userModel;
  }

  // Signup controller: creates a new user after hashing the password.
  async signup(req, res) {
    try {
      const { name, email, password } = req.body;

      // Check if the user already exists.
      const existingUser = await this.userModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash the password before storing it.
      const hashedPassword = await bcrypt.hash(password, 10);
      // Create the new user. Adjust the create method to match your model.
      const newUser = await this.userModel.create({
        name,
        email,
        password: hashedPassword,
      });

      res.status(201).json({
        message: 'User created successfully',
        user: newUser,
      });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(500).json({ message: 'Signup failed' });
    }
  }

  // Signin controller: validates user credentials and returns a JWT token.
  async signin(req, res) {
    try {
      const { email, password } = req.body;

      // Retrieve the user from the database.
      const user = await this.userModel.findByEmail(email);
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Compare the provided password with the stored hashed password.
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Create a JWT token using a secret key from your environment variables.
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({
        message: 'Signin successful',
        token,
      });
    } catch (error) {
      console.error('Signin error:', error);
      res.status(500).json({ message: 'Signin failed' });
    }
  }
}
