'use strict';
import {JWTHelper, Response} from '../helpers'
import {userRepository} from '../repositories'

export default class Authentication {

    static isAuth = async (req, res, next) => {
        try {
            let token = null;
            if (req.query.token !== undefined) {
                token = req.query.token;

            } else if (req.headers.authorization !== undefined) {
                token = req.headers.authorization;
            } else if (req.body.token !== undefined) {
                token = req.body.token;
            }
            if (token !== null && token.includes('Bearer')) {
                const tokens = token.split('Bearer ');
                if (tokens.length === 2) {
                    token = token.split('Bearer ')[1];
                }
            }
            if (token === null) {
                return Response.returnError(res, new Error('Token is not provided'));
            }
            const jwtValid = await JWTHelper.verify(token);
            const user = userRepository.getOne({
                where: {
                    id: jwtValid.id
                },
                attributes: ['id', 'username', 'displayName']
            });
            if (!user) {
                return Response.returnError(res, new Error('User invalidate'));
            }
            req.user = user;
            // return Response.returnSuccess(res, decoded);
            return next();
        } catch (e) {
            return Response.returnError(res, e);
        }
    };

    static authenticateSocket = async (socket) => {
        const token = socket.handshake.query.token;
        if (token === undefined) {
            return Promise.reject(new Error ('Cannot authenticate your connection'));
        }
        const jwtValid = await JWTHelper.verify(token);
        const user = userRepository.getOne({
            where: {
                id: jwtValid.user.id
            },
            attributes: ('id')
        });
        if (!user) {
            return (new Error('User invalidate'));
        }
        socket.user = jwtValid;
    }

}