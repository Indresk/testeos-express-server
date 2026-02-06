const express = require('express');
const open = require('open');
const path = require('path');
const ProductManager = require('./class/ProductManager')

const puerto = 8080;
const dbPath = path.join(__dirname, 'db', 'db.json');
const productManager = new ProductManager(dbPath)

const app = express()
app.use(express.json())

//html de testeos

app.get("/",(req,res)=>{
    res.status(200).sendFile(path.join(__dirname,'index.html'))
})

// products

app.get("/api/products",async (req,res)=>{
    const products = await productManager.getProducts()
    res.status(200).send(JSON.stringify(products))
})
app.get("/api/products/:pid",async (req,res)=>{
    const products = await productManager.getProducts(req.params.pid)
    res.status(200).send(JSON.stringify(products))
})

app.post("/api/products",async (req,res)=>{
    const body = req.body
    const internalResponse = await productManager.createProduct(body.title,body.description,body.code,body.price,body.status,body.stock,body.category,body.thumbnails)
    res.status(201).send(JSON.stringify(internalResponse))
})

app.put("/api/products/:pid",async (req,res)=>{
    const body = req.body
    const internalResponse = await productManager.updateProduct(req.params.pid,body.action,body.value)
    res.status(200).send(JSON.stringify(internalResponse))
})

app.delete("/api/products/:pid",async (req,res)=>{
    const internalResponse = await productManager.deleteProduct(req.params.pid)
    res.status(200).send(JSON.stringify(internalResponse))
})

// cart

app.get("/api/carts/:cid",async (req,res)=>{
    // Debe listar los productos que pertenecen al carrito con el cid proporcionado.
    res.status(200).sendFile()
})

app.post("/api/carts",async (req,res)=>{
    //  Debe crear un nuevo carrito con la siguiente estructura:
        // id: Number/String (Autogenerado para asegurar que nunca se dupliquen los ids).
        // products: Array que contendrá objetos que representen cada producto.
    res.status(201).send('product Created')
})
app.post("/api/carts/:cid/product/:pid",async (req,res)=>{
    // Debe agregar el producto al arreglo products del carrito seleccionado, utilizando el siguiente formato:
    //     product: Solo debe contener el ID del producto.
    //     quantity: Debe contener el número de ejemplares de dicho producto (se agregará de uno en uno).
    //     Si un producto ya existente intenta agregarse, se debe incrementar el campo quantity de dicho producto.
    res.status(201).send('product Created')
})

app.listen(puerto,()=>{
    console.log(`Servidor levantado en el puerto ${puerto}`)
    //open.openApp(`http://localhost:${puerto}`)
})

