const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

let ingredients = [
    {
        id: '232kAk',
        text: 'Eggs'
    },
    {
        id: 'dkP345',
        text: 'Milk'
    },
    {
        id: 'dkcuu7',
        text: 'Bacon'
    },
    {
        id: '73hdy',
        text: 'Frogs Legs'
    }
];

app.get('/ingredients', (req, res) => {
    res.send(ingredients);
});

app.post('/ingredients', (req, res) => {
    const ingredient = req.body;

    if (!ingredient.text) {
        res.status(400).send({error: 'Your ingredient must have text'});
    } else {
        ingredients.push(ingredient);
        res.send(ingredients);
    }
});

app.put('/ingredients/:id', (req, res) => {
    const text = req.body.text;
    let ingredientFound = false;

    if (!text) {
        res.status(400).send(
            {error: 'You must provide a valid ingredient id and text.'
        });
    } else {
        ingredients.map((ingredient) => {
            if (ingredient.id === req.params.id) {
                ingredient.text = text;
                ingredientFound = true;
            }
            return ingredient;
        });

        if (ingredientFound) {
            res.send(ingredients);
        } else {
            res.status(404).send({error: 'Ingredient not found.'});
        }
    }

});

app.delete('/ingredients/:id', (req, res) => {
    const ingredientId = req.params.id;
    const ingredient = ingredients.find(
        ingredient => ingredient.id === ingredientId
    );

    if (ingredient) {
        ingredients = ingredients.filter(
            item => item !== ingredient
        );
        res.send(ingredients);
    } else {
        res.status(404).send(
            {error: 'Ingredient not found.'}
        );
    }
});

app.listen(3000, () => {
    console.log('First API running on port 3000!');
});
