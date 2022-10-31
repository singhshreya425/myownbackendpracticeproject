const midd1 = function(req, res, next){
    console.log("reached to midd1")
    //logic for login authentication
    const islogin = false
    if(!islogin){
        return res.send("not login, please login first")
    }
    // const islogin = req.header('islogin')
    // if islogin
    //next()
}
module.exports = midd1
//waiter take order and goes to chef inform and chef handover the dish to waiter and waiter place that dish in front of customer 
//if it is not available then waiter will refuse the customer
//next( ) task is to proceed further 