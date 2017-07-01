import {
  Chain
} from 'fluid-chains';
import {
  INPUT_HANDLER
} from './Chain.info';

const InputHandlerChain = new Chain(INPUT_HANDLER, (context, param, next) => {
  const inputMap = param.util_inputMap();
  process.argv.forEach(function(val, index, array) {
    if (inputMap[val]) {
      context.set(inputMap[val], array[++index]);
    }
  });
  next();
});
InputHandlerChain.addSpec('util_inputMap', true);