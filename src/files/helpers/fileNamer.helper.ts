
export const fileNamer = (rea: Express.Request, file: Express.Multer.File, callback: Function) =>{

    if(!file) return callback (new Error("File is empty"), false);
    
    const fileExt = file.mimetype.split('/')[1]
    const fileName = file.originalname

    callback(null, fileName)
}