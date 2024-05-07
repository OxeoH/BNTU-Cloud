import fs from "fs";
import { File } from "./file.entity";
import { FileType } from "./file.types";

class FileManager {
  public async createDirOrFile(file: File) {
    const filePath = process.env.FILES_PATH + `\\${file.user.id}\\${file.path}`;
    console.log(file.path);

    return new Promise((resolve, reject) => {
      try {
        if (!fs.existsSync(filePath)) {
          if (file.type === FileType.DIR) {
            fs.mkdirSync(filePath);
            resolve({ message: "Directory created successfully" });
          } else {
            fs.appendFileSync(filePath, "");
            resolve({ message: "Error: File created successfully" });
          }
        } else {
          if (file.type === FileType.DIR) {
            reject({ message: "Directory already exists" });
          } else {
            reject({ message: "Error: File already exists" });
          }
        }
      } catch (e) {
        return reject({ error: "Unknown FileManager error" });
      }
    });
  }

  public async deleteFile(file: File) {
    const filePath = process.env.FILES_PATH + `\\${file.user.id}\\${file.path}`;

    if (file.type === FileType.DIR) {
      fs.rmdirSync(filePath);
    } else {
      fs.unlinkSync(filePath);
    }
    fs;

    return new Promise((resolve, reject) => {
      try {
        if (!fs.existsSync(filePath)) {
          fs.rmdirSync(filePath);
          resolve({ message: "Directory created successfully" });
        } else {
          reject({ message: "Error: Directory already exists" });
        }
      } catch (e) {
        return reject({ error: "Error: Unknown FileManager error" });
      }
    });
  }

  public checkIsExists(path: string) {
    if (fs.existsSync(path)) return true;
    return false;
  }
}

export default new FileManager();
