const connection = require('../database/conection');

//Busca os incidents criados pela ong do id passado, e busca todos os campos do incident
module.exports = {
    async index(request, response) {
        const ong_id = request.headers.authorization;
        const incidents = await connection('incidents')
        .where('ong_id', ong_id)
        .select('*');

        return response.json(incidents);
    }

}