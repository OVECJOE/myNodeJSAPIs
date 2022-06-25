const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const db = mongoose.connect('mongodb://localhost/swag-shop');

const Product = require('./model/product');
const WishList = require('./model/wishlist');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post('/product', (req, res) => {
    const product = new Product({
        title: req.body.title,
        price: req.body.price,
    });

    product.save((err, newProduct) => {
        if (err) {
            res.status(500).send(
                {error: "Could not save product; Try again."}
            );
        } else {
            res.send(newProduct);
        }
    })
});

app.get('/product', (req, res) => {
    Product.find({}, (err, products) => {
        if (err) {
            res.status(500).send(
                {error: "Could not fetch products at this time; Try again."}
            );
        } else {
            res.send(products);
        }
    });
});

app.post('/wishlist', (req, res) => {
    const wishList = new wishlist({title: req.body.title});

    wishList.save((err, newWishList) => {
        if (err) {
            res.status(500).send({error: "Could not create wishlist; Try again"});
        } else {
            res.send(newWishList);
        }
    });
});

app.get('/wishlist', (req, res) => {
    WishList.find({}).populate({path: 'products', model: 'Product'}).exec(
        (err, wishLists) => {
            if (err) {
                res.status(500).send("Could not fetch wishlists");
            } else {
                res.send(wishLists);
            }
        }
    );
});

app.put('/wishlist/product/add', (req, res) => {
    Product.findOne({_id: req.body.productId}, (err, product) => {
        if (err) {
            res.status(500).send({error: "Could not add item to wishlist."});
        } else {
            WishList.updateOne({_id: req.body.wishListId},
                {$addToSet: {products: product._id}},
                (err, wishList) => {
                    if (err) {
                        res.status(500).send({error: "Could not add item to wishlist"});
                    } else {
                        res.send(wishList);
                    }
                }
            )
        }
    });
});

app.listen(3000, () => {
    console.log('Swag Shop API running on port 3000...');
});