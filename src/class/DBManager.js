const path = require('path');
const fs = require('fs/promises')

class DBManager{
    constructor(pointingDB){
        this.db = pointingDB || ''
        this.availableDBs = []

        this.#loadAvailableDBs();
    }

    // metodos de mantenimiento

    async createDB(fileName,containerRoute){
        try {
            if(!containerRoute)containerRoute = "../db"
            const filePath = await this.#writeFile({fileName:fileName,containerRoute:containerRoute,data:JSON.stringify([], null, 2),newFile:true})
            this.db = filePath
            this.consultDBs()
        } catch (error) {
            console.log("No se pudo crear el archivo: ",error.message)
        }
    }

    async deleteDB(index){
        const indexFixed = parseInt(index)
        console.log(`Proceso de eliminación iniciado para el index: ${indexFixed}`)
        try {
            if(indexFixed === undefined || indexFixed === null) throw new Error('Debe seleccionarse el index de la base de datos a eliminar, puedes usar el metodo consultDBs para conocerlo.')
            if(!this.availableDBs[index]) throw new Error("El índice seleccionado no corresponde a ninguna base de datos existente.")
            if(this.db === this.availableDBs[indexFixed]) throw new Error('No se puede eliminar la base de datos actualmente en uso.')
            await fs.rm(this.availableDBs[indexFixed])
            this.availableDBs.splice(indexFixed, 1);
        } catch (error) {
            console.log("No se pudo eliminar el archivo: ",error.message)
        }
    }

    consultDBs(){
        console.log(`Las bases de datos disponibles son las siguientes:`)
        this.availableDBs.map((dbRoute,index)=>console.log(`Index: ${index} | Ruta: ${dbRoute}`))
        console.info(`\nLa base de datos seleccionada es: ${this.db}`)
    }

    selectDB(indexSelector){
        const indexFixed = parseInt(indexSelector)
        try{
            if(indexFixed === undefined || indexFixed === null) throw new Error('Debe seleccionarse el index de la base de datos a eliminar, puedes usar el metodo consultDBs para conocerlo.')
            if(!this.availableDBs[index]) throw new Error("El índice seleccionado no corresponde a ninguna base de datos existente.")
            if(this.db === this.availableDBs[indexFixed]) throw new Error('No se puede seleccionar la base de datos actualmente seleccionada.')
            this.db = this.availableDBs[indexFixed]
            console.log(`Base de datos ${this.db} seleccionada exitosamente.`)
        }
        catch(error){
            console.log("No se pudo seleccionar el archivo: ",error.message)
        }
    }

    // metodos de lectura y escritura de las DB

    async updateFile(newData){
        try {
            await this.#writeFile({data:newData,allowOveride:true})
        } catch (error) {
            console.error(`No se pudo actualizar el archivo ${this.db}:`, error.message);
        }
    }

    async readFile(){
        try {
            const data = await fs.readFile(this.db, 'utf-8');
    
            if (!data.trim()) return []
            try {
                const parsed = JSON.parse(data);
                return Array.isArray(parsed) ? parsed : [];
            } catch (parseError) {
                throw new Error(`JSON malformado en ${this.db}: ${parseError.message}`);
            }
        } catch (error) {
            if(this.availableDBs.length !== 0)console.error(`Error leyendo ${this.db}:`, error.message);
            throw error
        }
    }

    async #writeFile({fileName,containerRoute = "../db", data = "", allowOveride = false,newFile=false}) {
        let filePath = ""
        
        if(newFile){
            filePath = path.isAbsolute(containerRoute)?path.join(containerRoute, fileName): path.resolve(__dirname, containerRoute, fileName);
        }
        else{
            filePath = this.db
        }
        
        try {
            if (!allowOveride) {
                await fs.writeFile(filePath, data, { flag: 'wx' });
            } else {
                await fs.writeFile(filePath, data);
            }
            if (!this.availableDBs.includes(filePath)) this.availableDBs.push(filePath);
            return filePath

        } catch (error) {
            if (!allowOveride && error.code === 'EEXIST') {
                throw new Error(`El archivo con la ruta ${filePath} ya existe y no puede ser sobreescrito`);
            }
            throw new Error(error.message);
        }
    }

    // metodo de inicialización

    async #loadAvailableDBs() {
        try {
            const dirPath = path.dirname(this.db);
            const files = await fs.readdir(dirPath);
            this.availableDBs = files.map((file)=> path.join(dirPath, file));
            if(this.availableDBs.length !== 0)this.consultDBs();
        } catch (error) {
            console.error(`Error cargando availableDBs: ${error.message}`);
        }
    }
}

module.exports = DBManager;