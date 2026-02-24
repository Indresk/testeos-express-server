const express = require('express')

// products

module.exports = function ({ productManager }) {
    const apiProdsRouter = express.Router()
    apiProdsRouter.use(express.json())


    apiProdsRouter.get("/",async (req,res)=>{
        const internalResponse = await productManager.getProducts()
        const responseStatus = internalResponse.status === "success"?200:404  
        res.status(responseStatus).send(JSON.stringify(internalResponse))
    })
    apiProdsRouter.get("/:pid",async (req,res)=>{
        const internalResponse = await productManager.getProducts(req.params.pid)
        const responseStatus = internalResponse.status === "success"?200:404  
        res.status(responseStatus).send(JSON.stringify(internalResponse))
    })

    apiProdsRouter.post("/",async (req,res)=>{
        const body = req.body
        const internalResponse = await productManager.createProduct(body.title,body.description,body.code,body.price,body.status,body.stock,body.category,body.thumbnails)
        const responseStatus = internalResponse.status === "success"?201:404 
        res.status(responseStatus).send(JSON.stringify(internalResponse))
    })

    apiProdsRouter.put("/:pid",async (req,res)=>{
        const body = req.body
        const internalResponse = await productManager.updateProduct(req.params.pid,body.action,body.value)
        const responseStatus = internalResponse.status === "success"?200:404 
        res.status(responseStatus).send(JSON.stringify(internalResponse))
    })

    apiProdsRouter.delete("/:pid",async (req,res)=>{
        const internalResponse = await productManager.deleteProduct(req.params.pid)
        const responseStatus = internalResponse.status === "success"?200:404
        res.status(responseStatus).send(JSON.stringify(internalResponse))
    })

    return apiProdsRouter
}