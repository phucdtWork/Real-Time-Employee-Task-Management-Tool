import {
    messageMiddleware, ownerMiddleware, employeeMiddleware
} from '../middleware/authMiddleware.js';
import { ownerRouter } from './ownerRouter.js';
import { employeeRouter } from './employeeRouter.js';
import { commonRouter } from './commonRouter.js';
import { messageRouter } from './messageRouter.js';

function routes(app) {
    app.use('/', commonRouter);
    app.use('/employee', employeeMiddleware, employeeRouter);
    app.use('/owner', ownerMiddleware, ownerRouter);
    app.use('/message', messageMiddleware, messageRouter);
}

export default routes;
