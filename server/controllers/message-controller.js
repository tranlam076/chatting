'use strict';

import {Group, User, Op, MemberGroup} from '../models';
import {Response} from '../helpers';
import {messageRepository, } from '../repositories';

export default class MessageController {

    getListMessages = async (req, res) => {
        try {
            const groupId = req.params.id;
            const {limit, page} = req.query;
            const offset = (page - 1)*limit;
            const messages = await messageRepository.getAll({
                offset,
                limit,
                include: [
                    {
                        model: User,
                        as: 'author',
                        attributes: ['id', 'username'],
                    }
                ],
                where: {
                    groupId,
                },
            });
            return Response.returnSuccess(res, messages);
        } catch (e) {
            console.log(e);
            return Response.returnError(res, new Error ('Cant get list messages'));
        }
    };
    createMessage = async (req, res) => {
        try {
            const {body, type} = req.body;
            //validate body and type here
            const groupId = req.params.id;
            const author = req.user; // sign jwt
            let newMessage = await messageRepository.create({
                body,
                type,
                authorId: author.id,
                groupId,
            });
            newMessage.dataValues.author = author;
            delete newMessage.dataValues.authorId;
            if (!res) {
                return newMessage;
            }
            return Response.returnSuccess(res, newMessage);
        } catch (e) {
            console.log(e);
            return Response.returnError(res, new Error('Can\'t create message'))
        }
    }
}