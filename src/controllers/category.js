export class CategoryController {
   constructor(categoryModel) {
      this.categoryModel = categoryModel;
   }

   getAll = async (req, res) => {
      try {
         const categories = await this.categoryModel.getAll();
         res.status(200).json({ results: categories });
      } catch (error) {
         return res.status(500).json({ message: error.message });
      }
   };

   create = async (req, res) => {
      const { name } = req.body;

      if (!name) {
         return res.status(400).json({ message: 'Name must be provided' });
      }
      try {
         const existingCategory = await this.categoryModel.getByName({ name });
         if (existingCategory) {
            return res.status(409).json({
               message: `category with name '${name}' already exists`,
            });
         }

         const newCategory = await this.categoryModel.create({ name });
         res.status(201).json({ name, categoryId: newCategory.insertId });
      } catch (error) {
         res.status(500).json({ message: error.message });
      }
   };
}
