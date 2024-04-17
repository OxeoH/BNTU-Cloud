import fs from "fs";
import { File } from "./file.entity";

class FileManager {
  public async createDir(file: File) {
    console.log("filePath");
    const filePath = process.env.FILES_PATH + `\\${file.user.id}\\${file.path}`;
    console.log(filePath);

    return new Promise((resolve, reject) => {
      try {
        if (!fs.existsSync(filePath)) {
          fs.mkdirSync(filePath);
          resolve({ message: "Directory created successfully" });
        } else {
          reject({ message: "Directory already exists" });
        }
      } catch (e) {
        return reject({ error: "Unknown FileManager error" });
      }
    });
  }
}

export default new FileManager();
