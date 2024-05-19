import fs from "fs";
import { File } from "./file.entity";
import { FileType } from "./file.types";

class FileManager {
  public async createDirOrFile(file: File) {
    const filePath = process.env.FILES_PATH + `\\${file.user.id}\\${file.path}`;
    console.log(file.path);

    console.log(file);

    return new Promise((resolve, reject) => {
      try {
        if (!fs.existsSync(filePath)) {
          if (file.type === FileType.DIR) {
            fs.mkdirSync(filePath);
            resolve({ message: "Directory created successfully" });
          } else {
            fs.appendFileSync(filePath, "");
            resolve({ message: "File created successfully" });
          }
        } else {
          if (file.type === FileType.DIR) {
            reject({ message: "Error: Directory already exists" });
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
    const filePath = process.env.FILES_PATH + `\\${file.user.id}${file.path}`;

    return new Promise((resolve, reject) => {
      try {
        if (fs.existsSync(filePath)) {
          if (file.type === FileType.DIR) {
            fs.rmdirSync(filePath);
            resolve({ message: "Directory was deleted successfully" });
          } else {
            fs.unlinkSync(filePath);
            resolve({ message: "File was deleted successfully" });
          }
        } else {
          if (file.type === FileType.DIR) {
            reject({ message: "Error: Directory was not found" });
          } else {
            reject({ message: "Error: File was not found" });
          }
        }
      } catch (e) {
        return reject({ error: e });
      }
    });
  }

  public checkIsExists(path: string) {
    if (fs.existsSync(path)) return true;
    return false;
  }
}

export default new FileManager();
