import { Router } from "express";
import rateLimit from "express-rate-limit";
import * as routes from './middlewares/middlewares'

/** 
 * `Router` é responsável por encapsular todas as rotas da aplicação e
 * exportá-la para "app.ts" em "src"
*/
const router = Router();

const registerLimiter = rateLimit({
    windowMs: 3 * 60 * 1000,
    max: 5,
    handler: function(req, res, next) {
      res.status(429).json({ message: "Muitas tentativas. Tente novamente mais tarde." });
    }
  });

router.post('/login', registerLimiter, routes.resolver(routes.login));
router.post('/register', registerLimiter, routes.resolver(routes.register));
router.post('/check/code', routes.resolver(routes.checkCode));
router.get('/new/code/:email?/:id?/', routes.resolver(routes.askCode));

export default router;