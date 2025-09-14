import express from 'express';
import CombinationController from 'src/controller/combination';

const CombinationRouter = express.Router();

CombinationRouter.post('/generate', async (req, res) => {
  try {
    const { items, length } = req.body;
    const result = await CombinationController.generateCombinations(items, length);
    res.status(201).json(result);
  } catch (e) {
    console.log(e);
  }
});

export default CombinationRouter;
