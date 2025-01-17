
export const fileFilter = (rea: Express.Request, file: Express.Multer.File, callback: Function) =>{

    if(!file) return callback (new Error("File is empty"), false);
    
    const fileExt = file.mimetype.split('/')[1]
    const validExtensions = ['jpg','jpeg','png']

    if ( validExtensions.includes(fileExt) ){
        return callback(null, true)
    }

    callback(null, false)
}