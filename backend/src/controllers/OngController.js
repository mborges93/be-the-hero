const crypto = require('crypto');
const connection = require('../database/conection');

module.exports = {
    async index (request, response){
        const ongs = await connection('ongs').select('*');
        
         return response.json(ongs);
    },

    async create(request, response) {
        
        //desestrututaração (garante que usuario nao envie um dado que nao queremos que ele preencha )
        const { name, email, whatsapp, city, uf } = request.body;

        //gera 4 bytes de caracteres aleatorios e converte numa string hexadecial
        const id = crypto.randomBytes(4).toString('HEX');

        await connection('ongs').insert({
            id,
            name,
            email,
            whatsapp,
            city,
            uf
        })


        return response.json({ id });
    }
};