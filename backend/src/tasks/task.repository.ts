import { Task } from './task.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskInput } from './task.input';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from '../users/user.entity';
import { Logger, InternalServerErrorException } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TasksRepository');

  async getTasks(filterInput: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterInput;
    const query = this.createQueryBuilder('task');

    query.where('task.userId = :userId', { userId: user.id });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'task.title LIKE :search OR task.description LIKE :search',
        { search: `%${search}%` },
      );
    }

    try {
      const tasks = query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user "${
          user.email
        }", Filters: ${JSON.stringify(filterInput)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async createTask(
    createTaskInput: CreateTaskInput,
    user: User,
  ): Promise<Task> {
    const { title, description } = createTaskInput;
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.user = user;

    try {
      await task.save();
    } catch (error) {
      this.logger.error(
        `Failed to create a task for user. Data: ${createTaskInput}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }

    // delete task.user;

    return task;
  }
}
