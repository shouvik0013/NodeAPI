const path = require("path");
const fs = require("fs");

const currentDirectory = path.dirname(require.main.filename);

module.exports.deleteFile = (filePath) => {
    const pathToRemoved = path.join(currentDirectory, filePath);
    fs.unlink(pathToRemoved, (err) =>
        console.log(">>>>>>>>>>>>File delete error", err)
    );

    //console.log(">>>>>>>>",path.join(currentDirectory, filePath));
};
