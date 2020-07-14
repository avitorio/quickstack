import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TaskType } from './task.type';
import { TasksService } from './tasks.service';
import {
  Logger,
  UseGuards,
  ValidationPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { CreateTaskInput } from './task.input';
import { Task } from './task.entity';
import { GetUser } from '../users/get-user.decorator';
import { User } from '../users/user.entity';
import { GqlAuthGuard } from '../auth/gql-auth-guard';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task-status.enum';

const AuthGuard = new GqlAuthGuard();

@Resolver(of => TaskType)
@UseGuards(AuthGuard)
export class TasksResolver {
  private logger = new Logger('TasksController');

  constructor(private tasksService: TasksService) {}

  @Query(returns => TaskType)
  getTaskById(
    @Args('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Query(() => [TaskType])
  getTasks(
    @Args('filterDto', ValidationPipe) filterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    this.logger.verbose(
      `User "${user.email}" retrieving all tasks. Filters: ${JSON.stringify(
        filterDto,
      )}`,
    );
    return this.tasksService.getTasks(filterDto, user);
  }

  @Mutation(returns => TaskType)
  createTask(
    @Args('createTaskInput') createTaskInput: CreateTaskInput,
    @GetUser() user: User,
  ): Promise<Task> {
    this.logger.verbose(
      `User creating a new task. Data: ${JSON.stringify(createTaskInput)}`,
    );

    return this.tasksService.createTask(createTaskInput, user);
  }

  @Mutation(returns => Boolean)
  deleteTask(
    @Args('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ): Promise<boolean> {
    return this.tasksService.deleteTask(id, user);
  }

  @Mutation(returns => TaskType)
  updateTaskStatus(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(id, status, user);
  }
}
