const Joi = require('@hapi/joi')

exports.updateCarSchema =
Joi.object().keys({
  make: Joi.string().required(),
  model: Joi.string().required(),
  model_year: Joi.number().min(4).required(),
  active: Joi.boolean().required()
})

exports.createCarSchema = Joi.object().keys({
  make: Joi.string().required(),
  model: Joi.string().required(),
  model_year: Joi.number().min(4).required()
})
