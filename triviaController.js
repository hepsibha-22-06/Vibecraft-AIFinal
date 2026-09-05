import { fallbackService } from '../services/fallbackService.js';

export async function getTriviaQuestions(req, res, next) {
  try {
    const { count = 5, category } = req.query;
    const questions = fallbackService.getTriviaQuestions({
      count: Number(count) || 5,
      category
    });

    return res.status(200).json({
      success: true,
      data: questions
    });
  } catch (error) {
    next(error);
  }
}
