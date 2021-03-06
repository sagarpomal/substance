import forEach from '../util/forEach'
import isBoolean from '../util/isBoolean'
import isNumber from '../util/isNumber'
import isString from '../util/isString'
import DefaultDOMElement from '../dom/DefaultDOMElement'
import DOMExporter from './DOMExporter'

/*
  Base class for custom HTML exporters. If you want to use XML as your
  exchange format see {@link model/XMLExporter}.
*/

export default class HTMLExporter extends DOMExporter {
  constructor (params, options = {}) {
    super(_defaultParams(params, options), options)
  }

  exportDocument (doc) {
    const htmlEl = DefaultDOMElement.parseHTML('<html><head></head><body></body></html>')
    return this.convertDocument(doc, htmlEl)
  }

  getDefaultBlockConverter () {
    return defaultBlockConverter // eslint-disable-line no-use-before-define
  }

  getDefaultPropertyAnnotationConverter () {
    return defaultAnnotationConverter // eslint-disable-line no-use-before-define
  }
}

function _defaultParams (params, options) {
  params = Object.assign({
    idAttribute: 'data-id'
  }, params, options)
  if (!params.elementFactory) {
    params.elementFactory = DefaultDOMElement.createDocument('html')
  }
  return params
}

const defaultAnnotationConverter = {
  tagName: 'span',
  export: function (node, el) {
    el.tagName = 'span'
    el.attr('data-type', node.type)
    var properties = node.toJSON()
    forEach(properties, function (value, name) {
      if (name === 'id' || name === 'type') return
      if (isString(value) || isNumber(value) || isBoolean(value)) {
        el.attr('data-' + name, value)
      }
    })
  }
}

const defaultBlockConverter = {
  export: function (node, el, converter) {
    if (node.isText()) {
      el.append(converter.annotatedText(node.getPath()))
    }
  }
}
