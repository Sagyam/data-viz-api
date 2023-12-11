import { File } from '../entities/file.entity';

export class FilesResponseDto {
  dataItems: File[];
  page: number;
  pageSize: number;
  total: number;
}
