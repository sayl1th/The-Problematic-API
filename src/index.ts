/* eslint-disable new-cap */
import 'reflect-metadata'
import { createConnection } from 'typeorm'
import { resolve } from 'path'
import logger from './app/logger'
import config, { safeConfig } from './config'
import server from './server'

logger.info(safeConfig, 'Loaded config')

server
  .listenAsync(config.server.port)
  .then(() => {
    createConnection({
      type: 'sqlite',
      database: ':memory:',
      synchronize: true,
      logging: true,
      entities: [resolve(__dirname, 'app/entities/*.js')],
    })
      .then(() => {
        // console.log(getConnection())
        logger.info('connected to db')
      })
      .catch(error => {
        logger.error(error.message)
        process.exit(1)
      })
    logger.info(`Server started, port=${config.server.port}`)
  })
  .catch((error: Error) => {
    logger.error('Server failed to start', error)
    process.exit(1)
  })

export default server
