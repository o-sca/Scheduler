import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async getAll(userId: number) {
    try {
      const events = await this.prisma.event.findMany({
        where: {
          event_owner_id: userId,
        },
        include: {
          Event_Attendance: true,
        },
      });
      return events;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async create(userId: number, dto: CreateEventDto) {
    try {
      await this.prisma.event.create({
        data: {
          event_owner_id: userId,
          title: dto.eventTitle,
          start_date_time: dto.startDate,
          end_date_time: dto.endDate,
          Event_Attendance: {
            createMany: {
              data: dto.friends.map((friend) => {
                return {
                  user_attende_id: friend.id,
                  response_type: 'PENDING',
                };
              }),
            },
          },
        },
      });
      return;
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }
}