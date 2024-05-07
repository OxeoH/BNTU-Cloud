import fs from "fs";
import { File } from "./file.entity";

class FileManager {
  public async createDir(file: File) {
    const filePath = process.env.FILES_PATH + `\\${file.user.id}\\${file.path}`;

    return new Promise((resolve, reject) => {
      try {
        if (!fs.existsSync(filePath)) {
          fs.mkdirSync(filePath);
          resolve({ message: "Error: Directory created successfully" });
        } else {
          reject({ message: "Error: Directory already exists" });
        }
      } catch (e) {
        return reject({ error: "Unknown FileManager error" });
      }
    });
  }

  public async deleteFile(file: File) {
    const filePath = process.env.FILES_PATH + `\\${file.user.id}\\${file.path}`;

    return new Promise((resolve, reject) => {
      try {
        if (!fs.existsSync(filePath)) {
          fs.rm(filePath);
          resolve({ message: "Error: Directory created successfully" });
        } else {
          reject({ message: "Error: Directory already exists" });
        }
      } catch (e) {
        return reject({ error: "Unknown FileManager error" });
      }
    });
  }

  public checkIsExists(path: string) {
    if (fs.existsSync(path)) return true;
    return false;
  }
}

export default new FileManager();
