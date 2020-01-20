#!/usr/bin/env node
import yargs = require('yargs')
import rc from 'rc'

import { roadmapExport, RoadmapExtractOptions } from './api'

const conf = rc('roadmap-extract', {
  //defaults go here.
  host: 'https://git.novadiscovery.net',
  token: 'undefined'
})


const argv = yargs
  .config(conf)
  .options({
    'pid': { type: 'number', alias: ['p'], description: 'Project id', required: true },
    'token': { type: 'string', description: 'Project token (use rc file instead)', required: false },
    'host': { type: 'string', description: 'Gitlab host', required: false },
    'template': { type: 'string', alias: ['t'], enum: ['classic', 'details', 'light', 'slide'], description: 'Template type', required: false, default: 'classic' },
  })
  .argv

const options: RoadmapExtractOptions = {
  host: argv.host,
  pid: argv.pid,
  token: argv.token,
  template: argv.template as ( 'classic' | 'full' | 'light' | 'slides' ),
}

roadmapExport(options).catch(error => {
  console.error('Error: ', error.message)
  process.exit(1)
})
