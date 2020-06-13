const connection = require('../database/connection')

module.exports = {
    async list(req, res) {
        const list = await connection('payments').select('*')
        return res.json(list)
    },

    async add(req, res){
        const {title, value, date, comments} = req.body
        // aqui é onde calcula-se a External Tax
        let externalTax = value * 0.05
    
        try{
            if (title.length < 5 )  return res.json({error:'title length less than 5'})
            await connection('payments').insert({
                title,
                value,
                date, 
                externalTax,
                comments
            })
        } catch (error){
            return res.json({error:error.stack})
        }
        return res.sendStatus(200)
    },

    async remove(req, res, next) {
        let {id} = req.body
        try{
            await connection('payments').where({id}).del({id})
            return res.send()
        } catch (error){
            next(error)
        }
        
    },
    async update(req, res, next) {
        try {
            if (req.body.updateLine !== undefined )
                req.body = req.body.updateLine;
            const {id} = req.body

            const dbInfo = await connection('payments').where({id}).select("*")

            if (dbInfo[0].value !== req.body.value && dbInfo[0].externalTax === req.body.externalTax){
                req.body.externalTax =  req.body.value*0.05
            } 

            if (req.body.title.length <5 ) {
                return res.json({error:"Title length < 5"})
            }

            const { title, value, date, externalTax, comments} = req.body

            await connection('payments')
            .update({ title, value, date, externalTax, comments })
            .where({ id })

            return res.send()
        } catch (error) {
            next(error)
        }
    }
}