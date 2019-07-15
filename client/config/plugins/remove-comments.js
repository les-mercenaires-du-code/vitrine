const parser = require('@babel/parser');
const _ = require('lodash');
const utils = require('loader-utils');
const validateOptions = require('schema-utils');


const schema = {
  type: 'object',
  properties: {
    babel: {
      type: 'object',
      properties: {
        sourceType: {
          type: 'string',
        },
        plugins: {
          type: 'array',
        }
      }
    },
    preserve: {
      type: 'array',
    },
  },
  additionalProperties: false,
};

function keepPreserved(value, preserve) {
  return _.some(preserve, (test) => {
    return _.startsWith(_.trimStart(value), test);
  });
}

function removeComment(ast, content, opts) {

  if (!_.size(ast.comments)) {
    return content;
  }

  let ret;
  _.each(ast.comments, (comment) => {

    ret = ret || content;
    switch (comment.type) {
      case 'CommentBlock': {
        if (keepPreserved(comment.value, opts.preserve || opts.preserveBlock)) {
          break;
        }
        ret = ret.replace(`/*${comment.value}*/`, '');
        break;
      }
      case 'CommentLine': {
        if (keepPreserved(comment.value, opts.preserve || opts.preserveLine)) {
          break;
        }
        ret = ret.replace(`//${comment.value}`, '');
        break;
      }
      default:
      console.log('Unhandled comment type', comment.type);
    }
  });

  return ret;
}


function rmCommentsLoader(content) {

  const settings = utils.getOptions(this);
  validateOptions(schema, settings, 'Loader/@lmdc/remove-comments-loader');

  try {
    const ast = parser.parse(content, settings.babel);
    return removeComment(ast, content, _.omit(settings, 'babel'));
  } catch (e) {
    console.log(e);
  }

  return content;
}

module.exports = rmCommentsLoader;
