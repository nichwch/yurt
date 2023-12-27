import fs from 'fs'
import path from 'path'

export const getAllEligibleFiles = (dirPath:string, files:string[] = []) => {
    const entries = fs.readdirSync(dirPath);
  
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry);
      if (fs.statSync(fullPath).isDirectory()) {
        getAllEligibleFiles(fullPath, files);
      } else {
        files.push(fullPath);
      }
    }

    const usableFiles = files.filter((file) => {
      const extension = file.split(".").pop();
      // don't index hidden files
      if (extension?.[0] === ".") return false;
      // don't index txt or md files
      if (extension !== "txt" && extension !== "md") return false;
      return true;
    });
  
    return usableFiles;
  }