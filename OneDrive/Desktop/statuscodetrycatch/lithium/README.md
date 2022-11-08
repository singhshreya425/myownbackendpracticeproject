# lithium
# HTTP status code & try catch



# TRY CATCH SUMMARY:
// if you get an error in try block, it will not execute the next lines of code inside try
// instead it will jump into catch block and execute the code there
// code in catch block is normallly not executed
//rather catch block is only executed if there is error in try block
// the error( along with message++) gets sent to catch block incase there is an error


# Specific HTTP codes(only impt ones)
// 2xx- Success
// 4xx- something gone wrong..and problem is on user side(client side)
// 5xx- server side problems

// "BAD REQUEST" ...400..say if username password dont match etc..or anything generic( any problem in input on user side or any other unhandled problem)
// "RESOURCE NOT FOUND"...404 //404 page not found...eg. find ("asaijndianud89")...let book =bookModel.findOne({_id:"asaijndianud89"})   if (book){..} else res.status(404).send({})
// "AUTHENTICATION MISSING"...401..login is required...if(token){...} else { res.status(401)}
// "NOT AUTHENTICATED OR FORBIDDEN"..403 // if ( token.userId === userId) {...} else {res.status(403).send({}) }
// -- try catch ....// "SERVER ERROR"...500

// -- ALL GOOD... //status(200)- OK
// --- "ALL GOOD and A NEW RESOURCE WAS SUCCEFULLY CREATED" ...status(201)..e.g a new user registers herself successfully

# PROMISE
promise has typically 3 states
- pending : not awaited and has not completed yet ( typically when you don't await an axios or db call)
-Rejected: when promise failed( wrong url , server down etc)
-Fulfilled -: promise completed succesfully (e.g db call has completed )
-setteled-:refers to a combination of either rejected or fulfilled

# What is a promise?
-layman's definition : It is something in JS that tells us whether an operation has completed or not (pending)
-technical definition: it is a JS object that  represents whether  an asynchronous operation (like db call or axios call) is completed or not 

The two type of asynchronous call that we know is DB call and AXIOS call 

Axios is not only the library but its most popular and versatile library

# Template literal 
variable inside the string 
url/$id


//Git link..go thourghly this code thoroughly .. it will result in a confusion when you are going through  the code -postman se hit kar rhe hai and same axios se  bhi hit kar rhe hai .. why?  
write a get api to the 