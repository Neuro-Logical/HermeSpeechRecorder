const fs = require('fs');
const path = require('path');
const fileType = require('file-type')

const uploadDir = path.resolve(__dirname, '../../uploads');

const isFileType = async (data, filename)=>{
    // Determine the file type based on the extension
    if(filename){
        const ext = path.extname(filename);

        if(ext == '.csv'){
            return {
                ext: 'csv',
                mime: 'text/csv'
            }
        }
    }

    const type = await fileType.fromBuffer(data);
    return type
}

exports.get_all_audios = async (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        try {
            const arr = []
            files.forEach(file => {
                arr.push({
                    name: file,
                    path: path.join(uploadDir, file)
                })
            });

            return res.json(arr)
        } catch (err) {
            console.log(err)
            return res.status(500).json(err)
        }
    });
}

exports.download_single_audio = async (req, res) => {
    try {
        const { filename } = req.body;
        const file = path.join(uploadDir, filename);
        
        fs.readFile(file, async function(err, data) {
            if (err) {
                return res.status(500).json(err);
            }

            const base64File = Buffer.from(data).toString('base64');
            const type = await isFileType(data, filename);
            
            res.json({
                file: base64File,
                filename: filename,
                type
            })
        });
    } catch (error) {
        return res.status(500).json(error)
    }
}

// exports.download_all_audios = async (req, res) => {
//     try {
//         const { filename } = req.body;
//         const file = path.join(uploadDir, filename);
//         res.download(file)
//     } catch (error) {
//         return res.status(500).json(error)
//     }
// }