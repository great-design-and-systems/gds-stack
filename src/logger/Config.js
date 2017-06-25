import { Chain } from 'fluid-chains';
import { LOGGER_CONFIG } from './Chain.info';
import log4js from 'log4js';

let loggerName;
export const Logger = (loggerName) => {
    return log4js.getLogger(loggerName);
}
const LoggerConfigAction = (context, param, next) => {
    log4js.loadAppender('file');
    log4js.addAppender(log4js.appenders.file(param.loggerFilePath()), param.loggerName());
    if (param.level) {
        log4js.setLevel(param.level());
    }
    next();
}
const LoggerConfigChain = new Chain(LOGGER_CONFIG, LoggerConfigAction);

LoggerConfigChain.addSpec('loggerFilePath', true);
LoggerConfigChain.addSpec('loggerName', true);
LoggerConfigChain.addSpec('level', false);