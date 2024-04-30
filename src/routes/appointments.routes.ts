import { Router } from 'express'
import { startOfHour, parseISO } from 'date-fns'
import AppointmentsRepository from '../repositories/AppointmentsRepository'

const appointmentsRouter = Router()
const appointmentsRepository = new AppointmentsRepository()

// DTO - Data Transfer Object

//SoC: Separation fo Concerns (Separação de preocupaçoes)

appointmentsRouter.get('/', (request, response) => {
	const appointments = appointmentsRepository.all()
	response.json(appointments)
})

appointmentsRouter.post('/', (request, response) => {
	const { provider, date } = request.body

	const parsedDate = startOfHour(parseISO(date))

	const findAppointmentInSameDate =
		appointmentsRepository.findByDate(parsedDate)

	if (findAppointmentInSameDate) {
		return response
			.status(400)
			.json({ message: 'Este compromisso já está agendado' })
	}

	const appointment = appointmentsRepository.create({
		provider,
		date: parsedDate,
	})

	return response.json(appointment)
})

export default appointmentsRouter
