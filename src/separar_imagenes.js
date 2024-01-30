const fs = require('fs');
const sharp = require('sharp');

// Función para determinar si la imagen es horizontal o vertical
function determinarOrientacion(imagenPath) {
    return new Promise((resolve, reject) => {
        sharp(imagenPath)
            .metadata()
            .then(metadata => {
                if (metadata.width >= metadata.height) {
                    resolve('horizontal');
                } else {
                    resolve('vertical');
                }
            })
            .catch(err => {
                reject(err);
            });
    });
}

// Función para crear directorios si no existen
function crearDirectorioSiNoExiste(directorio) {
    if (!fs.existsSync(directorio)) {
        fs.mkdirSync(directorio);
    }
}

// Función principal para separar imágenes
async function separarImagenes(imagenes) {
    try {
        const directorioHorizontales = './imagenes/horizontales';
        const directorioVerticales = './imagenes/verticales';

        crearDirectorioSiNoExiste(directorioHorizontales);
        crearDirectorioSiNoExiste(directorioVerticales);

        for (const imagen of imagenes) {
            const orientacion = await determinarOrientacion(imagen);
            const destino = orientacion === 'horizontal' ? directorioHorizontales : directorioVerticales;
            const nombreArchivo = imagen.split('/').pop(); // Obtiene el nombre del archivo de la ruta
            fs.copyFileSync(imagen, `${destino}/${nombreArchivo}`);
        }

        console.log('Imágenes separadas con éxito.');
    } catch (err) {
        console.error('Error al procesar imágenes:', err);
    }
}

// Ejecución principal
const directorioImagenes = './imagenes';
fs.readdir(directorioImagenes, (err, files) => {
    if (err) {
        console.error('Error al leer el directorio de imágenes:', err);
        return;
    }

    const imagenes = files.map(file => `${directorioImagenes}/${file}`);
    separarImagenes(imagenes);
});
