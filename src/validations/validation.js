



//__________________________Validations:validURL______________________________
   
const isValidURL = function(url){

    const ValidateURL =  /["http://www.sample.com","https://www.sample.com/","https://www.sample.com#","http://www.sample.com/xyz","http://www.sample.com/#xyz","www.sample.com","www.sample.com/xyz/#/xyz","sample.com","sample.com?name=foo","http://www.sample.com#xyz","http://www.sample.c"]/;
    
   return ValidateURL.test(url)
  
  
   }


   //____________________________________Validation:string__________________________________
   const isValidString= function(value){
     if(typeof value === "undefined"  ||  value=== null) return false
     if(typeof value !== "string") return false
     if(value.trim().length == 0) return false
     return true;
     
   }



   //________________________________Validation:ValidUrlCode__________________________________


   
   const isValidURLCode = function(url){

   
    
        const ValidateURLCode = /^[a-z0-9-_]{9}$/;
        
       return ValidateURLCode.test(url)
      
      
       }
    
    
  
  
  //__________________________________________________________________
   










module.exports= {isValidURL,isValidURLCode,isValidString }