const connection = require('../database/conection');

module.exports ={
    async create(request, response){
        //busca o id no corpo da requisição
        const { id } = request.body;

        //busca uma ong no banco de dados com id = da requisição
        const ong  = await connection('ongs')
        .where('id', id)

        //seleciona o nome
        .select('name')

        //retorna apenas um resultado
        .first();
        
        //caso a ong nao exista!
        if(!ong){
            return response.status(400).json({ error: 'No ONG found with this ID'});
        }
        
        return response.json(ong);
    }
}