import { Router } from 'express'
import { parseISO } from 'date-fns'

import AppointmentsRepository from '../repositories/AppointmentsRepository'
import CreateAppointmentService from '../services/CreateAppointmentService'

const appointmentsRouter = Router()
const appointmentsRepository = new AppointmentsRepository()

// Define um tipo de erro personalizado que estende Error
class AppError extends Error {
	constructor(message: string) {
		super(message)
		this.name = 'AppError'
	}
}

// Rota: Receber a requisição, chamar outro arquivo, devolver uma resposta

// DTO - Data Transfer Object

//SoC: Separation fo Concerns (Separação de preocupaçoes)
appointmentsRouter.get('/', (request, response) => {
	const appointments = appointmentsRepository.all()

	response.json(appointments)
})

appointmentsRouter.post('/', (request, response) => {
	try {
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
	} catch (err: unknown) {
		// Utilizando unknown para a variável err
		if (err instanceof AppError) {
			return response.status(400).json({ error: err.message })
		}
		// Se não for um erro conhecido, retorna um erro genérico
		return response.status(500).json({ error: 'Erro interno do servidor' })
	}
})

export default appointmentsRouter
