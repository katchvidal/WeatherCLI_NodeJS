require('dotenv').config()
const {inquirerMenu,
    Pause,
    reed,
    listarlugares
    
} = require('./Helpers/inquirer');
const Busquedas = require('./Models/Busqueda');


console.log('Hello Wolrd')


const main = async()=>{

    const busquedas = new Busquedas();
    let opt;
    

    do {
        
        //  Menu Interactivo
        opt = await inquirerMenu()
        
        switch (opt) {
            case 1:
                //  Mostrar Mensaje
                const termino_busqueda = await reed('Ingre la Ciudad a Buscar: ')
                const lugares = await busquedas.ciudad(termino_busqueda)
                const id = await listarlugares(lugares)
                if (id === '0') continue;
                const sel = lugares.find(l => l.id === id)

                //  Guardar en BD
                busquedas.GuardarHistorial(sel.nombre)
                //  Buscar los Lugares
                //  Seleccionar el Lugar
                //  Datos del clima [   Weather ]  
                const clima = await busquedas.WeatherCity(sel.lat, sel.lon)
                console.clear()
                console.log('\nInformacion de la Ciudad:\n'.green)
                console.log('Ciudad:', sel.nombre)
                console.log('Latitud:', sel.lat)
                console.log('Longitud:', sel.lon)
                console.log('Temperatura:', clima.temp)
                console.log('Temperatura Maxima:', clima.max)
                console.log('Temperatura Minima:', clima.min)
                console.log('Como esta el clima:', clima.desc.green)
                break;

            case 2:
                busquedas.Capitalize.forEach((lugar, i)=>{
                    const idx = `${i+1}.`.green;
                    console.log(`${idx} ${lugar}`)
                })
                break;
        
        }

       if (opt !== 0) await Pause();


    } while (opt !== 0);
}




main();