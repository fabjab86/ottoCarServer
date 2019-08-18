exports.internalServerError = (err, res) => {
  console.log(err)
  if (!err.statusCode) err.statusCode = 500
  res.status(err.statusCode).send({
    status: err.statusCode,
    error: err.message
  })
}

exports.successStatus = (res, result) => {
  res.status(200).send({
    status: 'success',
    data: result.rows
  })
}

exports.failedErrorMessage = (err, res) => {
  console.log(err)
  if (!err.statusCode) err.statusCode = 500
  res.status(err.statusCode).send({
    status: 'failed',
    error: err.message
  })
}

exports.invalidRequestError = (res) => {
  res.status(422).json({
    status: 'error',
    message: 'Invalid request'
  })
}

exports.successCarAdded = (res) => {
  res.status(201).send({
    status: 'success',
    message: 'Car added'
  })
}

exports.successCarDeleted = (res) => {
  res.status(200).send({
    status: 'success',
    message: 'Car deleted'
  })
}

exports.successCarDetailsUpdated = (res) => {
  res.status(201).send({
    status: 'success',
    message: 'Car details updated'
  })
}
