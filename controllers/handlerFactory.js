const catchAsync = require("./../UTILS/catchAsync")
const APIFeatures = require("./../UTILS/apiFeatures");
const appError = require("./../UTILS/appError");
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    //try{
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new appError("No  document Found with that ID", 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
    // } catch (err) {
    //     res.status(404).json({
    //       status: "Failed",
    //       message: err,
    //     });
    //   }
  });


exports.updateOne = Model => catchAsync(async (req, res, next) => {
  // try {
  const doc = await  Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidator: true,
  });
  if (!doc) {
    return next(new appError("No document Found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      data: doc
    },
  });
  // } catch (err) {
  //   res.status(404).json({
  //     status: "Failed",
  //     message: err,
  //   });
  // }
});

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
    //     try{

    // }catch(err){
    //     res.status(400).json({
    //         status:'Failed',
    //         message:err
    //     })
    // }
  });
  //
  exports.getOne = (Model, popOptions) => catchAsync(async(req,res,next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    // try{

    //  const doc =    await Model.findById(id).populate('reviews')
    ///
    if (!doc) {
      return next(new appError("No doc Found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  }) 

  //
  exports.getAll = (Model) =>
    catchAsync(async (req, res, next) => {
        //To allow nested get reviews on tour
         let filter = {}
  //
  if(req.params.tourId) filter = {tour: req.params.tourId}; //if theres is a tour id then the object would be found 
      //  try{

      //////
      //EXECUTE QUERY
      const features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .pagination();

      // const doc = await features.query.explain();
const doc = await features.query;
      res.status(200).json({
        status: "Succes",

        results:doc.length,
        data: {
        data: doc,
        },
      });
      //  }catch(err){
      //     res.status(404).json({
      //         status: 'fail',
      //         message:err
      //     })
      //  }
    });