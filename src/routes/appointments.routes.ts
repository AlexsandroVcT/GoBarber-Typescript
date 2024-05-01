import { Router } from 'express'
import { parseISO } from 'date-fns'

import AppointmentsRepository from '../repositories/AppointmentsRepository'
import CreateAppointmentService from '../services/CreateAppointmentService'

const appointmentsRouter = Router()
const appointmentsRepository = new AppointmentsRepository()

// Rota: Receber a requisição, chamar outro arquivo, devolver uma resposta

// DTO - Data Transfer Object

//SoC: Separation fo Concerns (Separação de preocupaçoes)
appointmentsRouter.get('/', (request, response) => {
	const appointments = appointmentsRepository.all()

	response.json(appointments)
})

appointmentsRouter.post('/', (request, response) => {
	const { provider, date } = request.body

	const parsedDate = parseISO(date)

	const createAppointment = new CreateAppointmentService(
		appointmentsRepository,
	)

	const appointment = createAppointment.execute({
		date: parsedDate,
		provider,
	})

	return response.json(appointment)
})

export default appointmentsRouter
