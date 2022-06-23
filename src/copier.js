#!/usr/bin/env node
const { spawnSync } = require('child_process')
const { join } = require('path')
const fs = require('fs')

process.setUncaughtExceptionCaptureCallback(error => {
  console.error('Something went wrong copying project.', error)
  process.exit(1)
})

const getTime = (date = new Date()) => {
  return date.toLocaleString('en-US', {
    hour12: true,
    day: '2-digit',
    month: 'long',
    weekday: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const log = operation => {
  const process = operation[0]
  const step = operation[1]
  console.log(`✨ ${step}\n`, String(process.stdout))
  process.stderr
    && typeof String(process.stderr) === 'string'
    && String(process.stderr).trim().length
    && console.log(`🍅 ${step}\n`, String(process.stderr))
}

const spawnOptions = {
  cwd: process.cwd(),
  env: process.env,
  stdio: 'pipe',
  encoding: 'utf-8',
  shell: true,
}

module.exports = async function () {
  const filePathOrigin = process.argv[2]
  const filePathDestiny = process.argv[3]

  if (!filePathOrigin || !fs.existsSync(filePathOrigin)) {
    console.log('Path of origin is invalid')
    process.exit(1)
  }
  if (!filePathDestiny || !fs.existsSync(filePathDestiny)) {
    console.log('Path of destiny is invalid')
    process.exit(1)
  }

  const delEverythingFromDestiny = [
    spawnSync('rm', ['-rf', join(filePathDestiny, '/*')], spawnOptions),
    'Step 1 - Deleting everything in destiny project except the dotfiles',
  ]
  log(delEverythingFromDestiny)

  const delNodeModulesFromOrigin = [
    spawnSync('rm', ['-rf', join(filePathOrigin, 'node_modules')], spawnOptions),
    'Step 2 - Deleting node_modules from origin project',
  ]
  log(delNodeModulesFromOrigin)

  const copyGitIgnore = [
    spawnSync('cp', ['-R', join(filePathOrigin, '.gitignore'), filePathDestiny], spawnOptions),
    'Step 3 - Copying gitignore file',
  ]
  log(copyGitIgnore)

  const copyEslintConfig = [
    spawnSync('cp', ['-R', join(filePathOrigin, '.eslintrc.json'), filePathDestiny], spawnOptions),
    'Step 4 - Copying eslint config file',
  ]
  log(copyEslintConfig)

  const copyRest = [
    spawnSync('cp', ['-R', join(filePathOrigin, '/*'), filePathDestiny], spawnOptions),
    'Step 5 - Copying rest of files',
  ]
  log(copyRest)

  console.log(`Done on ${getTime()}`)
  process.exit(0)
}
