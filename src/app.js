const express = require('express');
const open = require('open');
const path = require('path');
const ProductManager = require('./class/ProductManager')
const CartManager = require('./class/CartManager')

const puerto = 8080;
const dbPath = path.join(__dirname, 'db/prods', 'products-db.json');
const cartDBPath = path.join(__dirname, 'db/carts', 'carts-db.json');
const productManager = new ProductManager(dbPath)
const cartManager = new CartManager(cartDBPath,productManager)

const app = express()
app.use(express.json())

//html de testeos - forma generada con IA (queria algo mas bonito que postman para irlo probando mientras lo armaba)

app.get("/",(req,res)=>{
    res.status(200).sendFile(path.join(__dirname,'index.html'))
})

// products

app.get("/api/products",async (req,res)=>{
    const internalResponse = await productManager.getProducts()
    const responseStatus = internalResponse.status === "success"?200:404  
    res.status(responseStatus).send(JSON.stringify(internalResponse))
})
app.get("/api/products/:pid",async (req,res)=>{
    const internalResponse = await productManager.getProducts(req.params.pid)
    const responseStatus = internalResponse.status === "success"?200:404  
    res.status(responseStatus).send(JSON.stringify(internalResponse))
})

app.post("/api/products",async (req,res)=>{
    const body = req.body
    const internalResponse = await productManager.createProduct(body.title,body.description,body.code,body.price,body.status,body.stock,body.category,body.thumbnails)
    const responseStatus = internalResponse.status === "success"?201:404 
    res.status(responseStatus).send(JSON.stringify(internalResponse))
})

app.put("/api/products/:pid",async (req,res)=>{
    const body = req.body
    const internalResponse = await productManager.updateProduct(req.params.pid,body.action,body.value)
    const responseStatus = internalResponse.status === "success"?200:404 
    res.status(responseStatus).send(JSON.stringify(internalResponse))
})

app.delete("/api/products/:pid",async (req,res)=>{
    const internalResponse = await productManager.deleteProduct(req.params.pid)
    const responseStatus = internalResponse.status === "success"?200:404
    res.status(responseStatus).send(JSON.stringify(internalResponse))
})

// cart

app.get("/api/carts/:cid",async (req,res)=>{
    const internalResponse = await cartManager.getCarts(req.params.cid)
    const responseStatus = internalResponse.status === "success"?200:404    
    res.status(responseStatus).send(JSON.stringify(internalResponse))
})

app.post("/api/carts",async (req,res)=>{
    const internalResponse = await cartManager.createCart()
    const responseStatus = internalResponse.status === "success"?201:404    
    res.status(responseStatus).send(JSON.stringify(internalResponse))
})
app.post("/api/carts/:cid/product/:pid",async (req,res)=>{
    const internalResponse = await cartManager.addProdToCart(req.params.cid,req.params.pid,req.body.quantity)
    const responseStatus = internalResponse.status === "success"?201:404
    res.status(responseStatus).send(JSON.stringify(internalResponse))
})

// escuchar puerto

app.listen(puerto,()=>{
    console.log(`Servidor levantado en el puerto ${puerto}`)
    open.openApp(`http://localhost:${puerto}`) 
})

