const express = require('express')
require('dotenv').config()
const PhoneBook = require('./models/Phone')
var morgan = require('morgan')
const cors = require('cors')
const Phone = require('./models/Phone')
const app = express()
app.use(express.json())
app.use(cors());
app.use(express.static('dist'))

morgan.token('req-body', (req) => {
  if (req.method === 'POST') {

    return JSON.stringify(req.body);
  }
  return '-'; 
});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'));

app.get('/',(request,response)=>response.send("Hello"))

app.get('/api/persons',
    (request,response)=>
       {
        PhoneBook.find({}).then
        (
          records=>
          {
            response.json(records)
          }
        )
       }
)

app.get('/info',
    (request,response)=>
       {
        const info = `Phonebook has info for ${PhoneBook.length} people`
        const time = new Date().toString();
        response.type('text').send(`${info}\n\n${time}`)
       }
)

app.get('/api/persons/:id',
    (request,response,next)=>
       {
        PhoneBook.findById(request.params.id).then(
          note=>{if (note) {
            response.json(note)
          } else {
            response.status(404).end()
          }}
      ).catch(error =>next(error))
       }
)

app.delete('/api/persons/:id',
    (request,response,next)=>
       {
        PhoneBook.findByIdAndDelete(request.params.id).then
        (
          result=> response.status(204).end()
        )
        .catch(
          error=>(next(error))
        )
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
      const Phone = new PhoneBook(
        {
          id:String(Math.floor(Math.random()*10000)),
          name:entry.name,
          number:entry.number,
         
        } 
      )
      Phone.save().then(savedPhone=>
        response.json(savedPhone)
      )
    }

)

app.put('/api/persons/:id',(request,response,next)=>
{
  const body = request.body
  const update ={name:body.name, number:body.number}
  PhoneBook.findByIdAndUpdate(request.params.id,update, {new:true})
  .then(updatedPhone=>
    response.json(updatedPhone)
  )
  .catch(error=>next(error))
}

)



const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler) 
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


