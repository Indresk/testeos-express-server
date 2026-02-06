class Product{
    constructor(id=0,title="titulo",description="desc",code=1,price=1,status=false,stock=1,category="no-cat",thumbnail=[]){
        this.id = id
        this.title = title
        this.description = description
        this.code = code
        this.price = price
        this.status = status
        this.stock = stock
        this.category = category
        this.thumbnail = thumbnail
    }

    // metodos de actualización progresiva

    addStock(value){ this.stock =+ value; }

    removeStock(value){ 
        if(this.stock<value) throw new Error(`No se puede bajar el stock por debajo de 0, el stock actual es ${this.stock}`);
        this.stock =- value;
    }

    addThumbnail(url){ this.thumbnail.push(url) }

    removeThumbnail(url){
        let urlIndex = this.thumbnail.indexOf(url)
        if(urlIndex === -1) throw new Error("No se encontró el thumbnail en este producto para retirarla.")
        this.thumbnail.splice(urlIndex,1);
    } 

    // metodos de actualización directa

    updateTitle(newTitle){ this.title = newTitle }

    updateDescription(newDesc){ this.description = newDesc }

    updatePrice(newPrice){ this.price = newPrice }

    updateStatus(newStatus){ this.status = newStatus; }

    updateCategory(newCategory){ this.category = newCategory; }

    // seteo de ID

    async setID(products){
        try {
            const ids = products.map((p)=>p.id).sort((a,b) => a-b);
            this.id = this.#findFreeId(ids)
        } catch (error) {
            console.log(`Error en el seteo de ID del producto: `,error.message)
        }
    }

    #findFreeId(ids){
        if (ids.length === 0) return 1;
        for (let i = 0; i < ids.length; i++) {
            const expected = i + 1;
            if (ids[i] !== expected) {
                return expected;
            }
        }
        return ids[ids.length - 1] + 1;
    }
}

module.exports = Product;