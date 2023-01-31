// //refactoring our tours
// class APIFeatures {
//   constructor(query, queryString) {
//     this.query = query;
//     this.queryString = queryString;
//   }
//   //creating a filtermethod
//   filter() {
//     const queryObj = { ...this.queryString };
//     //creating array for all the field we want to exclude..
//     const excludeFields = ["page", "sort", "limit", "fields"];
//     //looping thru our fields to remove all the fields from the query object..
//     excludeFields.forEach((el) => delete queryObj[el]);

//     //advanced filtering
//     //converting object to strng
//     let queryStr = JSON.stringify(queryObj);
//     queryStr = queryStr.replace(
//       /\b(gte|gt|lte|lt|)\b/g,
//       (match) => `$ ${match}`
//     );
//     const query = this.query.find(JSON.parse(queryStr));
//     return this;
//   }
//   //
//   sort() {
//     //2, Sorting ...
//     if (this.queryString.sort) {
//       const sortBy = req.queryString.sort.split(",").join("");
//       this.query = this.query.sort(sortBy);
//     } else {
//       //adding a default blog incase no query to sort ws added by the user

//       this.query = this.query.sort("-createdAt"); //the negative sign means they were oredered in descending format.
//     }
//     //return the method to have access so that we can then call them
//     return this;
//   }
//   //limit filds method
//   limitFields() {
//     //3, Field Limiting ?fields=-name , -duration to exclude the name and duration field.
//     if (this.queryString.fields) {
//       const fields = this.queryString.fields.split(",").join("");
//       this.query = this.query.select(fields);
//       //  query = query.select("name duration price"); //selection of only certain field names is called projecting
//     } else {
//       //if user doesnt specify the actual fields and also excluding the _V field in our Json data
//       this.query = this.query.select("-__v");
//     }
//     return this;
//   }
//   //pagination method..
//   pagination() {
//     //4, PAGINATION using this format page=2&limit=10, 1-10, page 1, 11-20,page2,21-30,page 3
//     const page = this.queryString.page * 1 || 1;
//     const limit = this.queryString.limit * 1 || 100;
//     const skip = (page - 1) * limit;
//     this.query = this.query.skip(skip).limit(limit);

//     //if theres a page in the query..
//     if (this.queryString.page) {
//       const newTours = Tour.countDocuments();
//       if (skip >= numTours) throw new Error("This page does not exist"); //Using the >= sign because of our skip method.
//     }
//     return this;
//   }
// }

// module.exports = APIFeatures;
/////////////////////////////////////////////////////////////////////////////////////////////////

//
class APIFeatures {
  constructor(query,queryString){
    this.query = query;
    this.queryString = queryString;
  }
  //Filtering
  filter(){
     //1a.Filtering
    const queryObj = { ...this.queryString};
    const excludedFields = ['page', 'sort','limit','fields'];
    excludedFields.forEach(el => delete queryObj[el])
    //1b,ADVANCED Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
   this.query = this.query.find(JSON.parse(queryStr));
 return this;
  }
  //sorting
  sort(){
    //2,SORTING...
    if(this.queryString.sort){
      const sortBy = this.queryString.sort.split(',').join('')
      console.log(sortBy)
        this.query = this.query.sort(sortBy);
    }else {
      //incase user does not specify any sorting..and incase the document are other at different time
      this.query = this.query.sort('-createdAt')
    }
    return this;
  }
  //Limiting
  limitFields(){
    //3,Fields Limiting...
    if(this.queryString.fields){
      const fields =  this.queryString.fields.split(',').join('');
    this.query = this.query.select(fields)
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  pagination(){
     ///4, PAGINATION
 //when the user search for all the pages he simply get 100 pages other than a milion page.
 const page = this.queryString.page * 1 || 1 //the * multiplication by one simply convert the strimg to number.
 const limit = this.queryString.limit * 1 || 100;
 const skip = (page - 1) * limit
 //page=2&limit=10,1-10 for page 1, and 11 -20 for page 2....
 this.query = this.query.skip(skip).limit(limit)

//  if(this.queryString.page){
//    const numTours = await Tour.countDocuments();
//    if(skip >= numTours) throw new Error('This page does not exist :(')
//  }
return this;
  }
}

module.exports = APIFeatures;