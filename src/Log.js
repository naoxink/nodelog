module.exports = (function(){

    const config = {
        'mode': 'console',
        'availableModes': [ 'console', 'file' ],
        'logPaths': {  },
        'defaultLogPath': './logs/',
        'logPrefix': '',
        'availableLogTypes': [ 'error', 'info', 'log' ]
    }

    const fs = require('fs')

    const throwError = msg => {
        const err = new Error(msg)
        throw err
    }

    const setDir = path => {
        if(!accessible(path)){
            fs.mkdirSync(path, { recursive: true })
        }
        if(!path.endsWith('/')){
            path += '/'
        }
        config.defaultLogPath = path
    }

    const getDefaultLogPath = logType => `${config.defaultLogPath}${config.logPrefix ? config.logPrefix + '_' : ''}${logType}.log`

    const setLogPrefix = prefix => config.logPrefix = prefix.trim()

    const accessible = path => {
        try{
            fs.accessSync(filePath, fs.constants.R_OK | fs.constants.W_OK)
        }catch(err){
            return false
        }
    }

    const setMode = (mode = 'console') => {
        if(!config.availableModes.includes(mode)){
            return throwError(`Mode "${mode}" not supported. (Available modes: ${config.availableModes.join(', ')})`)
        }
        config.mode = mode
        return true
    }

    const out = (str, logType = 'log') => {
        if(typeof str !== 'string') str = JSON.stringify(str)
        if(config.mode === 'console' && [ 'log', 'info', 'error' ].includes(logType.toLowerCase())){
            console[logType](formatLogLine(str, logType))
        }else if(config.mode === 'file'){
            writeToFile(formatLogLine(str, logType), logType)
        }
    }

    const formatLogLine = (str, logType) => `[${logType.toUpperCase()}] [${getTimeStamp()}] ${str}`

    const writeToFile = (str, logType = 'log') => {
        let filePath = config.logPaths[logType]
        if(!filePath){
            filePath = getDefaultLogPath(logType)
        }
        return fs.writeFileSync(filePath, str + '\n', { flag: 'a+' })
    }

    const getTimeStamp = () => {
        const now = new Date()
        const date = [
            now.getFullYear(),
            now.getMonth()+1 < 10 ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1),
            now.getDate() < 10 ? '0' + now.getDate() : now.getDate()
        ].join('-')
        const time = [
            now.getHours() < 10 ? '0' + now.getHours() : now.getHours(),
            now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes(),
            now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds()
        ].join(':')
        return `${date} ${time}`
    }

    const addLogType = function(logType) {
        if(! /^[a-zA-Z]+$/.test(logType)){
            throwError(`Log types cannot have spaces or special characters: "${logType}"`)
        }
        if(!config.availableLogTypes.includes(logType)){
            config.availableLogTypes.push(logType)
        }
        this[logType] = (str) => out(str, logType)
    }

    const getLogTypeMethods = () => {
        const methods = {  }
        config.availableLogTypes.forEach(lt => methods[lt] = (str) => out(str, lt))
        return methods
    }

    setDir(config.defaultLogPath)

    const resultObj = {
        setDir,
        setLogPrefix,
        setMode,
        ...getLogTypeMethods()
    }

    resultObj.addLogType = addLogType.bind(resultObj)

    return resultObj

})()