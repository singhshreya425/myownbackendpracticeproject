const CoinSchema = require( '../Models/CoinModel.js');
let axios = require( 'axios' )

let getCryptocurrency = async (req,res)=>{
    try {
        let options = {
            method: 'get',
            url: "https://api.coincap.io/v2/assets"
        }
        let result = await axios(options);
        
        let data = result.data.data
        let sortedData= data.sort((a,b)=>{ return a.changePercent24Hr - b.changePercent24Hr})
       
        await CoinSchema.deleteMany();
       
        let create = await CoinSchema.create(data)

        let resultdata = await CoinSchema.find().select({symbol:1,name:1,marketCapUsd:1,priceUsd:1})
    
       return  res.status(200).send( {data:resultdata} )
    }
    catch (err) {res.status(500).send({ msg: err.message })}
}

module.exports = { getCryptocurrency };