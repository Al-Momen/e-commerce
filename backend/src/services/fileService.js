import { access, unlink, writeFile, readFile } from 'node:fs/promises';
import path from 'node:path';
import { createError } from '../helper/helper';

class FileService {

    static async create(fileBuffer, fileName, fileExt, baseFolder = process.cwd()) {

        try {
            const finalFileName = fileName ?? Date.now().toString();
            const fullName = finalFileName + fileExt;
            const filePath = path.join(baseFolder, fullName);

            if (fileBuffer) {
                await writeFile(filePath, fileBuffer);
            }
            return filePath;
        } catch (error) {
            createError(error.message, 500);
        }
    }

    static async update(fileBuffer, fileName, fileExt, oldFile, baseFolder = process.cwd()) {

        try {
            const filePath = await this.create(fileBuffer, fileName, fileExt, baseFolder);
            if (!filePath) createError('Failed to create new file',500);

            if (oldFile) {
                await this.delete(oldFile, baseFolder);
            }

            return filePath;
        } catch (error) {
            createError(error.message, 500);
        }
    }

    static async delete(fileName, baseFolder = process.cwd()) {
        try {
            const filePath = path.join(baseFolder, fileName);
            await access(filePath);
            await unlink(filePath);
        }
        catch {
            createError("Image doesn't exists", 500);
        }
    }

    static async get(fileName) {
        try {
            const filePath = path.join(baseFolder, fileName);
            await access(filePath);
            const content = await readFile(filePath, 'utf-8');
            return content;
        } catch (error) {
            return null;
        }
    }
}
export { FileService }