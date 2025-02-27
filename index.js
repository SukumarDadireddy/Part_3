const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(cors());

morgan.token('req-body', (req) => {
  if (req.method === 'POST') {

    return JSON.stringify(req.body);
  }
  return '-'; // Return '-' for requests without a body
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'));
let phoneBook =
[
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/',(request,response)=>response.send("Hello"))

app.get('/api/persons',
    (request,response)=>
       {
        response.json(phoneBook)
       }
)

app.get('/info',
    (request,response)=>
       {
        const info = `Phonebook has info for ${phoneBook.length} people`
        const time = new Date().toString();
        response.type('text').send(`${info}\n\n${time}`)
       }
)

app.get('/api/persons/:id',
    (request,response)=>
       {
        const entry = phoneBook.find(e=>e.id===request.params.id)
        if(entry)
        {
        response.json(entry)
        }
        else 
        {
            response.status(404).end()
        }
       }
)

app.delete('/api/persons/:id',
    (request,response)=>
       {
        phoneBook=phoneBook.filter(e=>e.id!==request.params.id)
        response.status(202).json({id:request.params.id})
       }
)

app.post('/api/persons',
    (request,response)=>
    {
      const entry = request.body
      if(!entry.name || !entry.number)
      {
        return response.status(400).json({"error" : "content missing"}) 
      }
      if(phoneBook.find(e=>e.name===entry.name))
      {
        return response.status(400).json({"error" : "name must be unique"}) 
      }

    

      const record ={
        id:String(Math.floor(Math.random()*10000)),
        name:entry.name,
        number:entry.number,
       
      }

      phoneBook.push(record)
      response.json(record)
    }

)
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


