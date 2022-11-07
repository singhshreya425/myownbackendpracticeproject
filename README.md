# TOPIC: Authentication

## Authentication with JWT
- Token generation
- Token verification // jwt.verify() //authentication is successfull //if it is giving error that means u are not authenticated

*Note:* Remember that authentication means validating the identity of a user. Both token generation and verification together implement authentication. 
Think of this like getting an ID card the first day of your college and then showing that to a guard seated outside your college's campus gate in future. By showing them this token you are confirming your identity to them. Only a legitimate(valid) student who has taken the admission can own an official ID card.

## Assignment
- For this assignment you have to create a new branch - assignment/auth-1
- Your user document should look like this
```//inside model
 	{
    "_id" : ObjectId("6226e3d2b98f22b349ca58be"),
    "firstName" : "Sabiha",
    "lastName" : "Khan",
    "mobile" : "9898909087",
    "emailId" : "sk@gmail.com",
    "password" : "password123",
    "gender" : "female",
	"isDeleted": false, //default value is false 
    "age" : 12,
    "createdAt" : ISODate("2022-03-08T05:04:18.737Z"),
    "updatedAt" : ISODate("2022-03-08T05:04:18.737Z"),
    "__v" : 0
}
```


- Write a **POST api /users** to register a user from the user details in request body.
user data  and createuser , by making db call verify email and password which is created is correct or not 
- Write a ***POST api /login** to login a user that takes user details - email and password from the request body. If the credentials don't match with any user's data return a suitable error.
On successful login, generate a JWT token and return it in response body. Example 
```
{
    status: true,
    data: {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"

    }
 }
```
- (protected)Write a **GET api /users/:userId** to fetch user details. Pass the userId as path param in the url. Check that request must contain **x-auth-token** header. If absent, return a suitable error.
create header with
 header name **x-auth-token** 
 validate the token
 user id data should be fetch then pass the userId
If present, check that the token is valid.
-(protected) Write a **PUT api /users/:userId** to update user details. Pass the userId as path param in the url and update the attributes received in the request body. Check that request must contain **x-auth-token** header. If absent, return a suitable error.
-(protected) Write a **DELETE api /users/:userId** that takes the userId in the path params and marks the isDeleted attribute for a user as true. Check that request must contain **x-auth-token** header. If absent, return a suitable error.
isdeleted should be true
- Once, all the apis are working fine, move the authentication related code in a middleware called auth.js
- Add this middleware at route level in the routes where applicable.




Token never contain password we keep user info

where u will get ur token?-> in response we will get our token

How to verify that individual is authenticated or not?->by hitting post api, inside midddleware, if u r able to decode it then user authentication is correct, jwt verified if password is wrong then token will be fail, if password is wrong then code can also break and it will throw an error

you have to give message for login failed

payload- userid 


1 login == authenticat , isValid User
jwt 
what is jwt?
why we use jwt?
How we use jwt?

Header   // safe // model // how secure
Payload  // document  // {userId:"", password:""}
Signature/ secret key  // 121 password  // secret key


how we creat jwt toke?

const myToken = jwt.sign({userId:""}, 'your secret password')  //
const decoded = jwt.verify(myToken, 'your secret passworD');  //{ foo: 'bar',name:"sachin", id:""}
//{ foo: 'bar' }  //payload


body = { email:"sachin@gmail"}

const jwtToken 

res.send({token: jwtToken, message:"success"})
 
 after verification we create token
 we will create token in controller
 jwt sign in controller
 jwt verify in middleware
 when login api hit then we are creating token
