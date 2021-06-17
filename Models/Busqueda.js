const fs = require('fs')
const axios = require('axios')


class Busquedas {

    historial = [];

    //  Direccion Donde Guardara la base de datos
    dbpath = './Database/database.json'

    //  Leer DB si existe
    constructor(){

    }

   get ParamsMapBox (){
       return  {
        'access_token' : process.env.MapBox_KeyWeather,
        'limit':5,
        'language' : 'es'
    }
   }

    async ciudad (  lugar = ''  ) {

        try {
            //  Peticion HTTP
            const instance = axios.create({

                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
                params :  this.ParamsMapBox
            })

            const res = await instance.get();
            return  res.data.features.map(lugar =>({
                id : lugar.id,
                nombre : lugar.place_name,
                lon : lugar.center[0],
                lat : lugar.center[1]
            }))

        }catch (error ){

            return []
        }
    }

    get ParamsWeather (){
        return {

            appid : process.env.OpenWeather_KEY,
            units : 'metric',
            lang : 'es'

        }
    }

    async WeatherCity (  lat, lon ) {

        try {
            const instance = axios.create({
                baseURL : `https://api.openweathermap.org/data/2.5/weather`,
                params : {...this.ParamsWeather, lat, lon}
            })
            const res = await instance.get();
            const { weather, main } = res.data;
            return {
                desc    : weather[0].description,
                min     : main.temp_min,
                max     : main.temp_max,
                temp    : main.temp           
            }
        }catch{
        }
    }

    async GuardarHistorial (lugar = ''){

        if(this.historial.includes( lugar.toLowerCase() )){
            return;
        }

        this.historial  =   this.historial.splice(0,9)
        this.historial.unshift( lugar.toLowerCase() )
        //  Guardar en base de Datos
        this.SaveDB();
    }


    //  Grabar en Base de datos
    SaveDB() {
        const payload = {
            historial : this.historial
        };
    
        fs.writeFileSync(this.dbpath, JSON.stringify(payload))
    }

    ReadDB (){
        if (!fs.existsSync(this.dbpath)){
            return;
        }

        const info = fs.readFileSync(this.dbpath, {encoding : 'utf-8'});
        const data = JSON.parse(info);
        this.historial = data.historial;

    }

    get Capitalize(){

        return this.historial.map(  lugar   =>  {

            let palabras = lugar.split(' ');

            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1))

            return palabras.join(' ')
        })
    }
}


module.exports = Busquedas