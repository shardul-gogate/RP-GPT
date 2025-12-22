import fs from "fs";

export const getGameFilesToCopy = () => {
    return ["gamestate.json", "plotpoints.json", "progress.json", "quests.json"];
};

export const readFile = async (filePath) => {
    try {
        const data = await fs.promises.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(`Error reading file ${filePath}:`, err);
        throw new Error(`Failed to read data from ${filePath}`);
    }
};

export const writeFile = async (filePath, data) => {
    try {
        await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error(`Error writing file ${filePath}:`, err);
        throw new Error(`Failed to write data to ${filePath}`);
    }
};

export const makeDirectory = async (newDirPath) => {
    try {
        await fs.promises.mkdir(newDirPath, { recursive: true });
    } catch (err) {
        console.error(`Error creating directory ${newDirPath}:`, err);
        throw new Error(`Failed to create directory ${newDirPath}`);
    }
};

export const copyFile = async (sourcePath, destPath) => {
    try {
        await fs.promises.copyFile(sourcePath, destPath);
    } catch (err) {
        console.error(`Error copying file ${sourcePath} to ${destPath}:`, err);
        throw new Error(`Failed to copy file ${sourcePath} to ${destPath}`);
    }
};