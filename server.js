//express
const express = require('express')
const path = require('path')
const app = express()
app.use(express.json())

//method-override (for POST)
const middleware = require('method-override')('_method');
app.use(middleware)

//use URL encoded
app.use(require('express').urlencoded({extended: false}))



//route
app.get('/people', async(req,res,next)=> {
  try {
	// res.send(await person.findAll({include: [antique,person]}))
    const endhtml = `
	<form method = 'POST' action = '/people'>
	  <label for="fname">Name:</label><br>
	  <input type="text" id="fname" name="fname"><br>
	</form>
    `
    res.send('<html>'+(await person.findAll({include: [person]})).map(x=>`<li><a href = "/people/${x.id} ">${x.name}</a></li>`).join('')+endhtml + "</html>") 
  
	 res.send('hi')

  }
  catch(ex){
    next(ex)
  }
})

//route
app.get('/antiques', async(req,res,next)=> {
  try {
    const endhtml = `
	<form method = 'POST' action = '/people'>
	  <label for="fname">Name:</label><br>
	  <input type="text" id="fname" name="fname"><br>
	</form>
    `
    res.send('<html>'+(await antique.findAll()).map(x=>`<li>${x.name}</li>`).join('') + endhtml + "</html>") 
  }
  catch(ex){
    next(ex)
  }
})

//route
app.get('/people/:id', async(req,res,next)=> {
  try {
    const data = (await person.findAll({
	   include: [person],
      	   where: {
		id: req.params.id
	   }}))
    
    const data2 = (await person.findAll({
	    where: {
	        id: 1
    	   }}))
    const data3 = (await antique.findAll({
            where: {
		personId: req.params.id
    }}))

    html = `<html>${data.name}</html>`
	res.send(data[0].name + ` (child of ${data2[0].name}) and ${data3.map(x=>`<li>${x.name}</li>`).join('')}`)
  }
  catch(ex){
    next(ex)
  }
})

//route
app.post('/people', async(req,res, next)=>{
  try {
    const fname = await req.body.fname

    //console.dir(fname)
    await person.create({name: `${fname}`});
    res.redirect('/people');
  }
  catch(ex){
    next(ex);
  }
})


//sequelize
const Sequelize = require('sequelize')
const db = new Sequelize('postgres://localhost/dbs')  //we use the database 'dbs'

const person = db.define('person', { //define the person database
  name: Sequelize.STRING,
  parentId: Sequelize.INTEGER,
  personId: Sequelize.INTEGER

})

const antique = db.define('antique', { // define the antique database
  name: Sequelize.STRING,
  personId: Sequelize.INTEGER
})

//person.belongsTo(antique)

const syncAndSeed = async() => {

//TABLE PEOPLE sync and seed
await person.sync({force:true})
const persons = await person.findAll();
const personAdd = new person({name: 'Allie',personId: 1})
await personAdd.save()
const personAdd2 = new person({name: 'Betty',personId: 1})
await personAdd2.save()
const personAdd3 = new person({name: 'David',personId: 2})
await personAdd3.save()

//TABLE ANTIQUE sync and seed
await antique.sync({force:true})
const antiqueAdd1 = new antique({name: 'metrenome',personId: 2})
await antiqueAdd1.save()
const antiqueAdd2 = new antique({name: 'computer',personId: 2})
await antiqueAdd2.save()
const antiqueAdd3 = new antique({name: 'stamp collection',personId: 1})
await antiqueAdd3.save()
const antiqueAdd4 = new antique({name: 'card collection',personId: 3})
await antiqueAdd4.save()
const antiqueAdd5 = new antique({name: 'ancient pot',personId: 2})
await antiqueAdd5.save()
const antiqueAdd6 = new antique({name: 'lamp',personId: 2})
await antiqueAdd6.save()
const antiqueAdd7 = new antique({name: 'figurine',personId: 1})
await antiqueAdd7.save()
const antiqueAdd8 = new antique({name: 'harpsichord',personId: 3})
await antiqueAdd8.save()

antique.belongsTo(person)
person.hasMany(antique)
person.hasMany(person)
person.belongsTo(person)
}

// Sale.belongsTo(User)?






//syncAndSeed()

const init = async()=>{
  try {
    await syncAndSeed();
    const port = process.env.PORT || 3000;
    app.listen(port, ()=> console.log(`listening on port ${port}`))
  }
  catch(ex) {
    console.log(ex.message)
  }
}

init()
