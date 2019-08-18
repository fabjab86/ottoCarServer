const internalServerError = (err, res) => {
  console.log(err)
  if (!err.statusCode) err.statusCode = 500
  res.status(err.statusCode).send({
    status: err.statusCode,
    error: err.message
  })
}

const successStatus = (res, result) => {
  res.status(200).send({
    status: 'success',
    data: result
  })
}

const failedErrorMessage = (err, res) => {
  console.log(err)
  if (!err.statusCode) err.statusCode = 500
  res.status(err.statusCode).send({
    status: 'failed',
    error: err.message
  })
}

const invalidRequestError = (res) => {
  res.status(422).json({
    status: 'error',
    message: 'Invalid request'
  })
}

const successCarAdded = (res) => {
  res.status(201).send({
    status: 'success',
    message: 'Car added'
  })
}

const successCarDeleted = (res) => {
  res.status(200).send({
    status: 'success',
    message: 'Car deleted'
  })
}

const successCarDetailsUpdated = (res) => {
  res.status(201).send({
    status: 'success',
    message: 'Car details updated'
  })
}

const censor = (censor) => {
  var i = 0
  return (key, value) => {
    if (i !== 0 && typeof (censor) === 'object' && typeof (value) === 'object' && censor === value) { return '[Circular]' }

    if (i >= 29) { return '[Unknown]' }

    ++i

    return value
  }
}

module.exports = {
  internalServerError: internalServerError,
  successStatus: successStatus,
  failedErrorMessage: failedErrorMessage,
  invalidRequestError: invalidRequestError,
  successCarAdded: successCarAdded,
  successCarDeleted: successCarDeleted,
  successCarDetailsUpdated: successCarDetailsUpdated,
  censor: censor
}
