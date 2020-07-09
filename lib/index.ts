import { argv, exit } from "process";
import { List, Rename, Configs, ReadJson, WriteJson, OpenFile, DeleteFile } from "./util";
import path from "path";

if (argv.length <= 2) {
    console.error("No Path Provided.\n");
    exit(1);
}
const folder = path.resolve(argv[2]);

async function Generate() {
    const files = await List(folder);
    await WriteJson(path.join(folder, Configs.NewFile), files);
    await WriteJson(path.join(folder, Configs.OldFile), files);
}

async function Renamer() {
    const oldFiles = await ReadJson(path.join(folder, Configs.OldFile));
    const newFiles = await ReadJson(path.join(folder, Configs.NewFile));
    await Rename(oldFiles, newFiles);
}
async function Deleter(){
    await DeleteFile(path.join(folder, Configs.OldFile));
    await DeleteFile(path.join(folder, Configs.NewFile));
}
async function Run() {
    await Generate();
    console.log("Generated");
    await OpenFile(path.normalize(path.join(folder, Configs.NewFile)));
    await Renamer();
    console.log("Renamed");
    await Deleter();
}
Run().then(() => {
});    
