import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { del, put } from '@vercel/blob';
import { QueryParamsDto } from 'src/files/dto/query-params.dto';
import { FilesResponseDto } from 'src/files/dto/response-.dto';
import { PrismaService } from '../prisma/prsima.service';
import { CreateFileDto } from './dto/create-file.dto';

@Injectable()
export class FilesService {
  constructor(private prisma: PrismaService) {}

  async create(createFileDto: CreateFileDto, file: Express.Multer.File) {
    const { name, type } = createFileDto;

    if (file.mimetype !== 'text/csv') {
      throw new HttpException('File must be CSV', HttpStatus.BAD_REQUEST);
    }

    if (file.size > 1000000) {
      throw new HttpException('File too large', HttpStatus.BAD_REQUEST);
    }

    const blob = await put(file.originalname, file.buffer, {
      access: 'public',
    });

    return this.prisma.file.create({
      data: {
        name,
        type,
        url: blob.url,
      },
    });
  }

  async findAll(query: QueryParamsDto): Promise<FilesResponseDto> {
    const {
      page,
      pageSize,
      filterOperator,
      filterOn,
      filterQuery,
      sortBy,
      sortOrder,
    } = query;

    let where = {};
    if (!filterQuery) {
      where = {
        [filterOn]: {
          [filterOperator]: filterQuery,
        },
      };
    }

    const orderBy = { [sortBy]: sortOrder };

    const [dataItems, total] = await Promise.all([
      this.prisma.file.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.file.count({ where }),
    ]);

    return {
      dataItems,
      page,
      pageSize,
      total,
    };
  }

  async findOne(id: string) {
    const file = await this.prisma.file.findUnique({
      where: { id },
    });
    if (!file) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }
    return file;
  }

  async remove(id: string) {
    const file = await this.prisma.file.findUnique({
      where: { id },
    });
    if (!file) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }
    await del(file.url);

    return this.prisma.file.delete({
      where: { id },
    });
  }
}
