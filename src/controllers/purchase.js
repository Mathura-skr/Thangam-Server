// import { validatePartialQuery } from '../schemas/query.js';
// import { validatePurchase } from '../schemas/purchase.js';

// export class PurchaseController {
//    constructor(purchaseModel) {
//       this.purchaseModel = purchaseModel;
//    }

//    getAll = async (req, res) => {
//       const result = validatePartialQuery(req.query);

//       if (!result.success) {
//          return res
//             .status(400)
//             .json({ message: JSON.parse(result.error.message) });
//       }
//       const { page = 1, take = 10 } = result.data;

//       try {
//          const count = await this.purchaseModel.count({});
//          const totalPages = count !== 0 ? Math.ceil(count / take) : 1;

//          if (page < 1 || page > totalPages) {
//             return res.status(404).json({ message: 'Page not found' });
//          }

//          const purchases = await this.purchaseModel.getAll({
//             page,
//             take,
//          });

//          res.status(200).json({
//             page: page,
//             results: purchases ?? [],
//             total_results: count,
//             total_pages: totalPages,
//          });
//       } catch (error) {
//          return res.status(500).json({ message: 'Something went wrong' });
//       }
//    };

//    getByUser = async (req, res) => {
//       const { userId } = req.params;

//       const validatedResult = validatePartialQuery(req.query);

//       if (!validatedResult.success) {
//          return res
//             .status(400)
//             .json({ message: JSON.parse(validatedResult.error.message) });
//       }
//       const { page = 1, take = 10 } = validatedResult.data;

//       try {
//          const count = await this.purchaseModel.count({ userId });
//          const totalPages = count !== 0 ? Math.ceil(count / take) : 1;

//          if (page < 1 || page > totalPages) {
//             return res.status(404).json({ message: 'Page not found' });
//          }

//          const userPurchases = await this.purchaseModel.getByUser({
//             userId,
//             page,
//          });

//          res.status(200).json({
//             page: page,
//             results: userPurchases ?? [],
//             total_results: count,
//             total_pages: totalPages,
//          });
//       } catch (error) {
//          res.status(500).json({ message: 'Something went wrong' });
//       }
//    };

//    create = async (req, res) => {
//       const validatedResult = validatePurchase(req.body);

//       if (!validatedResult.success) {
//          return res
//             .status(400)
//             .json({ message: JSON.parse(validatedResult.error.message) });
//       }

//       const { items, paymentType, district, userId, comment } =
//          validatedResult.data;

//       try {
//          const newPurchase = await this.purchaseModel.create({
//             userId,
//             paymentType,
//             district,
//             comment,
//          });

//          const purchaseProducts = await this.purchaseModel.addProducts({
//             purchaseProducts: items,
//             purchaseId: newPurchase.purchase_id,
//          });

//          return res
//             .status(201)
//             .json({ ...newPurchase, products: purchaseProducts });
//       } catch (error) {
//          console.log(error);
//          res.status(500).json({ message: 'Something went wrong' });
//       }
//    };
// }
