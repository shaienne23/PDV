const aws = require('aws-sdk');

const endpoint = new aws.Endpoint(process.env.ENDPOINT_S3);

const s3 = new aws.S3({
    endpoint,
    credentials: {
        accessKeyId: process.env.KEY_ID,
        secretAccessKey: process.env.APP_KEY
    }
});


const uploadArquivo = async (path, buffer, mimetype) => {
    try {
        const arquivo = await s3.upload({
            Bucket: process.env.BACKBLAZE_BUCKET,
            Key: `imagens/${encodeURIComponent(path.replace(/[^\w\d-_.]+/g, '_'))}`,
            Body: buffer,
            ContentType: mimetype
        }).promise();

        return `https://${process.env.BACKBLAZE_BUCKET}.${process.env.ENDPOINT_S3}/${arquivo.Key}`
    } catch (error) {
        console.error('Erro no upload do arquivo:', error);
        throw error;
    };
}
const excluirArquivo = async (url) => {
    const path = 'imagens/' + url.split('/imagens/')[1];
  
    
    try {
        await s3.deleteObject({
            Bucket: process.env.BACKBLAZE_BUCKET,
            Key: path,
        }).promise();

     
    } catch (error) {
        console.error('Erro ao excluir o arquivo:', error);
        throw error;
    }
}

module.exports = {
    uploadArquivo, 
    excluirArquivo
}