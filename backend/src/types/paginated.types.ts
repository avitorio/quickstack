import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Type } from '@nestjs/common';

export function Paginated<T>(classRef: Type<T>): any {
  @ObjectType({ isAbstract: true })
  abstract class Meta {
    @Field(type => Int)
    itemCount: number;

    @Field(type => Int)
    totalItems: number;

    @Field(type => Int)
    itemsPerPage: number;

    @Field(type => Int)
    totalPages: number;

    @Field(type => Int)
    currentPage: number;
  }

  @ObjectType({ isAbstract: true })
  abstract class Links {
    @Field(type => String)
    first?: string;

    @Field(type => String)
    previous?: string;

    @Field(type => String)
    next?: string;

    @Field(type => String)
    last?: string;
  }

  @ObjectType({ isAbstract: true })
  abstract class PaginatedType {
    @Field(type => [classRef], { nullable: true })
    items: T[];

    @Field(type => Meta)
    meta: Meta;

    @Field(type => Links)
    links: Links;
  }
  return PaginatedType;
}
