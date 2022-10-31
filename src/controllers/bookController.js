const authorModel = require("../models/authorModel")
const bookModel= require("../models/bookModel")
const publisherModel = require("../models/publisherModel")
const {publisher} = require("./publisher")
const {db} = require("../models/authorModel")

const createBook= async function (req, res) {
    let book = req.body
    let {author_id,publisher} = book
    let authordetail = await authorModel.find();
    let publisherdetail = await publisherModel.find();
    const detail=authordetail.find(x=>x._id==author_id);
    const detail1=publisherdetail.find(x=>x._id==publisher);
    // if(!author_id){res.send("author is require"); return }
    // else if(detail==undefined){ res.send("id is not valid"); return } 
    // else if(!publisher){res.send("publisherid is require");return }
    // else if (detail1==undefined){res.send("publisher id is not valid"); return}
    let bookCreated = await bookModel.create(book)
    res.send({data: bookCreated})
}

const getBooksData= async function (req, res) {
    let books = await bookModel.find()
    res.send({data: books})
}

const getBooksWithAuthorDetails = async function (req, res) {
    let specificBook = await bookModel.find().populate('author_id')
    res.send({data: specificBook})

}
const updatebookbydata= async function (req,res){
    const body=req.body
    let update= await publisherModel.find({name:body.name})
    let bookupdate = await bookModel.findOneAndUpdate({publisher:update},{$set:{ isHardCover:true}},{new:true})
        return res.send({msg:bookupdate})
}
const updaterating= async function(req,res){
    let autherrating=await authorModel.find({rating:{$gt:3.5}})
    let bookupdate = await bookModel.updateMany({author_id:autherrating},{$set:{ $inc:{price:10}}},{new:true})
   return res.send({msg:bookupdate})
}


module.exports.createBook= createBook
module.exports.getBooksData= getBooksData
module.exports.getBooksWithAuthorDetails = getBooksWithAuthorDetails
module.exports.updatebookbydata=updatebookbydata
module.exports.updaterating=updaterating
