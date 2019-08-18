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

const allStats = (data, res) => {
  const allCarsAdded = data[0].length || 0
  const activeCarsCount = data[0].reduce((count, item) => {
    if (item.active === true) count.push(item)
    return count
  }, [])

  const inActiveCarsCount = data[0].reduce((count, item) => {
    if (item.active === false) count.push(item)
    return count
  }, [])

  const getRequests = data[1].reduce((count, item) => {
    if (item.request_type === 'GET') count.push(item)
    return count
  }, [])

  const deleteRequests = data[1].reduce((count, item) => {
    if (item.request_type === 'DELETE') count.push(item)
    return count
  }, [])

  const putRequests = data[1].reduce((count, item) => {
    if (item.request_type === 'PUT') count.push(item)
    return count
  }, [])

  const updateRequests = data[1].reduce((count, item) => {
    if (item.request_type === 'POST') count.push(item)
    return count
  }, [])

  res.status(200).send({
    status: 'success',
    data: [{
      allCars: allCarsAdded,
      activeCars: activeCarsCount.length,
      inactiveCars: inActiveCarsCount.length,
      getRequests: getRequests.length,
      deleteRequests: deleteRequests.length,
      putRequests: putRequests.length,
      updateRequests: updateRequests.length
    }]
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
  censor: censor,
  allStats: allStats
}
