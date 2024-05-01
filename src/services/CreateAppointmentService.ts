import { startOfHour } from 'date-fns'

import Appointment from '../models/Appointment'
import AppointmentsRepository from '../repositories/AppointmentsRepository'
/**
 * [x] Recebimento das informaçoes
 * [/]Tratativa de erros/excessôes
 * [x]Acesso ao repositório
 */

interface Request {
	provider: string
	date: Date
}

/**
 * Depedency Inversion (SOLID)
 */

class CreateAppointmentService {
	private appointmentsRepository: AppointmentsRepository

	constructor(appointmentsRepository: AppointmentsRepository) {
		this.appointmentsRepository = appointmentsRepository
	}

	public execute({ date, provider }: Request): Appointment {
		const appointmentDate = startOfHour(date)

		const findAppointmentInSameDate =
			this.appointmentsRepository.findByDate(appointmentDate)

		if (findAppointmentInSameDate) {
			throw Error('Este compromisso já está agendado')
		}

		const appointment = this.appointmentsRepository.create({
			provider,
			date: appointmentDate,
		})
		return appointment
	}
}

export default CreateAppointmentService
