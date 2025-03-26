export class UserController {
   #userModel = null;
   constructor(userModel) {
      this.#userModel = userModel;
   }

   getById = async (req, res) => {
      const { userId } = req.params;
      try {
         const user = await this.#userModel.getById(userId);

         if (!user) {
            return res.status(404).json({ message: 'User not found' });
         }

         res.status(200).json(user);
      } catch (error) {
         res.status(500).json({
            message: 'Something went wrong',
         });
      }
   };
}
