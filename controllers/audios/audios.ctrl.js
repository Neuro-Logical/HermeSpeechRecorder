const fs = require('fs');
const path = require('path');
const fileType = require('file-type')
const archiver = require('archiver');

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

exports.download_in_zip = async (req, res) => {
    try {
        const { filenames } = req.body;

        // Define zip filename
        res.attachment('audios.zip');

        // Initiate archiver
        const archive = archiver('zip', {
            zlib: { level: 9 } // Compression level
        });

        archive.on('error', (err) => {
            res.status(500).send({ error: err.message });
        });

        // Send the archive data to the output stream (response)
        archive.pipe(res);

        // Use createReadStream to add files to the archive
        filenames.forEach(filename=>{
            const file = path.join(uploadDir, filename);
            const fileStream = fs.createReadStream(file);
            archive.append(fileStream, { name: filename });
        })

        // Finalize the archive
        archive.finalize();
    } catch (error) {
        return res.status(500).json(error)
    }
}