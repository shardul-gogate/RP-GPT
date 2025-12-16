import fs from "fs";

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
