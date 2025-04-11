export interface IFileService {
  uploadFile(
    file: any,
    filePath: string,
  ): Promise<{
    Location: string;
    ETag: string;
    Bucket: string;
    Key: string;
  }>;
  getByKey(key: string): Promise<any>;
}
