import  {Response} from '../helpers'
export default class Validation {

    static validatePagination (req, res, next) {
        let {limit, page} = req.query;
        limit = parseInt(limit);
        page = parseInt(page);

        if (limit <= 0 && Number.isNaN(limit)) {
            return Response.returnError(res, new Error('Limit invalid'));
        }
        if (page <= 0 && Number.isNaN(page)) {
            return Response.returnError(res, new Error('Page invalid'));
        }
        return next ();
    }
}