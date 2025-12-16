import {access,unlink} from 'node:fs/promises';
import path from 'node:path';
const deleteFileAsync = async (fileName, baseFolder = process.cwd()) => {
    const filePath = path.join(baseFolder, fileName);
    try { 
        await access(filePath); 
        await unlink(filePath); 
    } 
    catch {
        console.error("Image doesn't exists");
    }
};
export default deleteFileAsync;