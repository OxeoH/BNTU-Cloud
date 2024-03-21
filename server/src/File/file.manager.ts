import fs from "fs";
import { File } from "./file.entity";

class FileManager {
  public async createDir(file: File) {
    const filePath = process.env.FILE_PATH + `/${file.user}/${file.path}`;
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath);
        resolve({ message: "Directory created successfully" });
      } else {
        reject({ message: "Directory already exists" });
      }
    });
  }
}

export default new FileManager();
