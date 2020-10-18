const express = require('express')
const sql = require('sqlite3')


const db = new sql.Database('clients.db')

db.serialize(() => {
    db.run("create table if not exists clients ( id integer primary key autoincrement, name char(30), unique (name) )")
})

const app = express()
app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))


app.get('/', (req,res) => {
    db.serialize(() => {
        db.all(`select * from clients`, (error, rows) => {
            if(error) return res.json({error})
            res.json(rows)
        })
    })
})

app.get('/:id', (req,res) => {
    db.serialize(() => {
        db.all(`select * from clients where id=`+req.params.id, (error, rows) => {
            if(error) return res.json({error})
            res.json(rows)
        })
    })
})

app.delete('/:id', (req,res) => {
    db.serialize(() => {
        db.run(`delete from clients where id=?`,[req.params.id],function(error){
            if(error) return res.json(error)
            res.json(this)
        })
    })
})

app.post('/', (req,res) => {
    db.serialize(() => {
        db.run(`insert into clients (name) values (?)`,[req.body.name],function(error){
            if(error) return res.json(error)
            res.json(this)
        })
    })
})

app.put('/:id', (req,res) => {
    db.serialize(() => {
        db.run(`update clients set name=? where id=?`,[req.body.name, req.params.id],function(error){
            if(error) return res.json(error)
            res.json(this)
        })
    })
})

app.use((error, req, res,next) => {
    res.json({error:error+''})
})


app.listen(8888, () => console.log('run in 8888'))