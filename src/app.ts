import express, { Application } from 'express'
import { connect } from 'mongoose'
import route from './routes/index'
import { MONGODB_URL } from './env'

export default class App {
  public app: Application

  public port: number

  public monogo_url: string

  constructor(port: number) {
    this.app = express()
    this.port = port
    this.monogo_url = MONGODB_URL
    this.connectToRoute()
    this.connectToMongo()
    this.staticAssests()
  }

  private connectToMongo() {
    const options = {
      // autoIndex: false, // Don't build indexes
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      useUnifiedTopology: true,
      useNewUrlParser: true,
      autoIndex: true, // make this also true
    }
    connect(this.monogo_url, options)
      .then(() => {
        console.log('info->', 'Connected to mongodb')
      })
      .catch((e) => {
        console.log(e)
        throw e
      })
  }

  private connectToRoute() {
    this.app.use(express.json())
    this.app.use(route)
  }

  private staticAssests() {
    this.app.use(express.static('public'))
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listning on port ${this.port}`)
    })
  }
}
