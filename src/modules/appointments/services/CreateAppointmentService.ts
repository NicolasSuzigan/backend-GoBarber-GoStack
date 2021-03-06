import { startOfHour } from 'date-fns';
import {injectable, inject} from 'tsyringe';
//import { getCustomRepository } from 'typeorm';

import Appointment from '../infra/typeorm/entities/Appointment';
//import AppointmentsRepository from '../repositories/AppointmentsRepository'
import AppError from '@shared/errors/AppError';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
    ){}

  public async execute({date, provider_id}:IRequest): Promise<Appointment> {
   // const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
      );

    if(findAppointmentInSameDate){
      throw new AppError(' This appointment is already booked');
    }

    const appointment = await this.appointmentsRepository.create({
        provider_id,
        date: appointmentDate,
      });

        return appointment;
  }
}

  export default CreateAppointmentService;

 // return response
  //    .status(400)
  //    .json({message:' This appointment is already booked'});