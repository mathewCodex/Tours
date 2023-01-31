// const express = require("express");
// const fs = require("fs");
// //including middle ware

// const app = express();
// app.use(express.json());
// // //listening to req..
// // app.get("/", (req, res) => {
// //   res
// //     .status(200)
// //     .json({ message: "We are Ballimg because life is good", app: "NATOURS" });
// // });
// // //post req..
// // app.post("/", (req, res) => {
// //   res.send("YOU can Post to This URL");
// // });
// //reading our file...
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/dev-data/toursimple.json`)
// );
// app.get("/api/v1/tours", (req, res) => {
//   res.status(200).json({
//     status: "success",
//     results: tours.length,
//     data: {
//       tours,
//     },
//   });
// });
// //getting data by ID..
// app.get("/api/v1/tours/:id", (req, res) => {
//   //convert id to numbers
//   const id = req.params.id * 1;
//   const tour = tours.find((el) => el.id === id);
//   //checking the length of our data to define our status code...
//   // if (id > tours.length) {
//   if (!tour) {
//     return res.status(404).json({ status: "fail", message: "invalid ID" });
//   }

//   res.status(200).json({
//     status: "success",
//     data: {
//       tour,
//     },
//   });
// });
// //sending a post request...
// app.post("/api/v1/tours", (req, res) => {
//   //console.log(req.body);
//   const newId = tours[tours.length - 1].id + 1;
//   const newTour = Object.assign({ id: newId }, req.body);

//   tours.push(newTour);
//   ///persisting data ot the file using the writeFile..
//   fs.writeFile(
//     `${__dirname}/dev-data/toursimple.json`,
//     JSON.stringify(tours),
//     (err) => {
//       res.status(201).json({
//         status: "Success",
//         data: {
//           tour: newTour,
//         },
//       });
//     }
//   );
// });
// //making a patch request to update properties...
// app.patch("/api/v1/tours/:id", (req, res) => {
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({ status: "fail", message: "invalid ID" });
//   }
//   //sending back a response..
//   res.status(200).json({
//     status: "Success",
//     data: {
//       tour: "Updated tour",
//     },
//   });
// });
// //deleting req handler...
// app.delete("/api/v1/tours/:id", (req, res) => {
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({ status: "fail", message: "invalid ID" });
//   }
//   //sending back a response..
//   res.status(204).json({
//     status: "Success",
//     data: null,
//   });
// });
// const port = 4000;
// app.listen(port, () => {
//   console.log(`App Is running at ${port}...`);
// });
