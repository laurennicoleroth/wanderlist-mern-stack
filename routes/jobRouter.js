import { Router } from 'express';
const router = Router();
import {
  getAllSpots,
  getSpot,
  createSpot,
  updateSpot,
  deleteSpot,
  showStats,
} from '../controllers/spotController.js';
import {
  validateSpotInput,
  validateIdParam,
} from '../middleware/validationMiddleware.js';
import { checkForTestUser } from '../middleware/authMiddleware.js';

// router.get('/',getAllSpots)
// router.post('/',createSpot)

router
  .route('/')
  .get(getAllSpots)
  .post(checkForTestUser, validateSpotInput, createSpot);

router.route('/stats').get(showStats);

router
  .route('/:id')
  .get(validateIdParam, getSpot)
  .patch(checkForTestUser, validateSpotInput, validateIdParam, updateSpot)
  .delete(checkForTestUser, validateIdParam, deleteSpot);

export default router;
