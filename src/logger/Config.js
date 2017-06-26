import { Chain } from 'fluid-chains';
import { LOGGER_CONFIG } from './Chain.info';
import log4js from 'log4js';

let loggerName;
export const Logger = (loggerName) => {
    return log4js.getLogger(loggerName);
}
const LoggerConfigAction = (context, param, next) => {
    log4js.loadAppender('file');
    log4js.addAppender(log4js.appenders.file(param.logger_filePath()), param.logger_name());
    if (param.logger_level) {
        log4js.setLevel(param.logger_level());
    }
    next();
}
const LoggerConfigChain = new Chain(LOGGER_CONFIG, LoggerConfigAction);

LoggerConfigChain.addSpec('logger_filePath', true);
LoggerConfigChain.addSpec('logger_name', true);
LoggerConfigChain.addSpec('logger_level', false);