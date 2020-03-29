const connection = require('../database/conection');

module.exports = {
    async index(request, response) {
        //busca dentro dos request query( parametros q usam?)
        const { page = 1 } = request.query;

        //busca no banco todos incidents / conta através do metodo count
        //[] em torno do count traz a primeira posição do array
        const [count] = await connection('incidents').count();
        console.log(count);

        const incidents = await connection('incidents')
            //Relaciona dados de duas tabelas
            //compara o ong_id e traz os dados da ong relacionada com o incident
            .join('ongs', 'ongs.id', '=', 'incidents.ong_id')

            //limita a busca em 5 incidents
            .limit(5)

            //faz com que o page pule os 5 primeiros registros
            .offset((page - 1) * 5)
            .select(['incidents.*',
                'ongs.name',
                'ongs.email',
                'ongs.whatsapp',
                'ongs.city',
                'ongs.uf'
            ]);

        //passa o total pelo cabeçãlho da resposta
        response.header('X-Total-Count', count['count(*)']);

        return response.json(incidents);
    },

    async create(request, response) {
        const { title, description, value } = request.body;
        const ong_id = request.headers.authorization;

        const [id] = await connection('incidents').insert({
            title,
            description,
            value,
            ong_id
        });

        return response.json({ id });
    },
    async delete(request, response) {
        const { id } = request.params;
        const ong_id = request.headers.authorization;

        const incident = await connection('incidents')
            .where('id', id)
            .select('ong_id')
            .first();

        if (incident.ong_id != ong_id) {
            return response.status(401).json({ error: 'Operation not permitted.' });
        }
        await connection('incidents').where('id', id).delete();

        //status 204 resposta sem conteudo!
        return response.status(204).send();
    }
};