import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
   const authorization = req.headers.authorization;
   let token = '';
   if (authorization && authorization.toLowerCase().startsWith('bearer')) {
      token = authorization.split(' ')[1];
   }

   try {
      const decodedData = jwt.verify(token, process.env.EXPRESS_SECRET_KEY);

      if (!decodedData.userId) {
         return res
            .status(401)
            .json({ error: 'There is no id in decoded token' });
      }

      req.userId = decodedData.id;
   } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
         return res.status(401).json({ message: error.message });
      }
      return res.status(400).json({ error: 'Invalid token' });
   }
   next();
};

export default auth;
