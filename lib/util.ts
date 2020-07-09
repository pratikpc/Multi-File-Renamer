import fs from "fs/promises";
import fsSync, { PathLike } from "fs";
import path from "path";
import {promisify} from "util";
import {exec} from "child_process";
const async_exec = promisify(exec);

export class File {
    [key: number]: string,
};
let index = 0;
export async function List(p_dir: string) {
    index = 0;
    const dir = path.resolve(p_dir);
    const files = await ListUtils(dir);
    return files;
}
async function ListUtils(dir: string, files_: File = {}
) {
    files_ = files_ || [];
    const files = await fs.readdir(dir);
    for (const i of files) {
        const name = path.join(dir, i);
        const stat = await fs.stat(name);
        if (stat.isDirectory()) {
            await ListUtils(name, files_);
        } else if (stat.isFile()) {
            if (path.basename(name) === Configs.NewFile || path.basename(name) === Configs.OldFile)
                continue;
            files_[index++] = name;
        }
    }
    return files_;
}

export async function WriteJson(file: string, files: File){
    await fs.writeFile(file, JSON.stringify(files, null, "\t"), 'utf8');
}

export async function DeleteFile(path: PathLike){
    await fs.unlink(path);
}

export async function ReadJson(file: string){
    const data = await fs.readFile(file, 'utf8');
    const json = JSON.parse(data);
    return json as File;
}

export async function OpenFile(file: string){
    await async_exec(`"${file}"`);

}

async function MKDir(path: string){
    if(!fsSync.existsSync(path))
        await fs.mkdir(path);
}

export async function Rename(oldFile: File, newFile: File) {
    const renames: Promise<void>[] = [];
    for (const file in newFile) {
        MKDir(path.dirname(newFile[file]));
        renames.push(fs.rename(oldFile[file], newFile[file]));
    }
    return await Promise.all(renames);
}
export class Configs{
    public static NewFile = ".NewFile.json";
    public static OldFile = ".OldFile.json";
}