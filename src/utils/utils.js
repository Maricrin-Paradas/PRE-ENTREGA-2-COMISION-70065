
import fs from "fs"

const data = fs.readFileSync("./products.json", "utf8")
let products = JSON.parse(data)

function guardarProducto (info)  {
    const {title, description, code, price, status, stock, category, thumbnails} = info
    let maxId = products.length
    let i = 1
    products.forEach(element => {
        let elementID = parseInt(element.id)
        if (elementID > i){
            maxId = i
        }else{
            i = i +1
        }
    });
    let productsReverse = products.toReversed()
    productsReverse.forEach(element => {
        let elementID = parseInt(element.id)
        if (elementID == maxId){
            maxId = elementID+1
        }
    });

    const newProduct = {
        id: maxId++,
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails:  ""
    }
    products.push(newProduct)
    //console.log(newProduct)
    products.sort((a,b) => a.id - b.id)
    try {
        const pushProducts = JSON.stringify(products, null, 2);
        fs.writeFileSync("./products.json", pushProducts)
    } catch (error) {
        console.log("error")
    }
}



export default guardarProducto