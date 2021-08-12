/*
 * alpine-teleport
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Copy/pasted from https://git.io/JRXTS#L26
 */
function closestDataStack(node) {
  if (node._x_dataStack) return node._x_dataStack

  if (node instanceof ShadowRoot) {
    return closestDataStack(node.host)
  }

  if (!node.parentNode) {
    return []
  }

  return closestDataStack(node.parentNode)
}

/**
 * Copy/pasted from https://git.io/JRXTS#L6
 */
function addScopeToNode(node, data, referenceNode) {
  node._x_dataStack = [data, ...closestDataStack(referenceNode || node)]

  return () => {
    node._x_dataStack = node._x_dataStack.filter((i) => i !== data)
  }
}

/**
 * Logs a warning to the console. The warning style is copied
 * from the alpine codebase
 */
function logWarning(message, expression, el) {
  console.warn(`${message}\n\nExpression: "${expression}"\n\n`, el)
}

/**
 * The teleport plugin factory
 */
export default function alpineTeleport($alpine) {
  /**
   * Teleport directive move the DOM node to a given target outside
   * of the parent x-data tree.
   */
  $alpine.directive('teleport', (el, { expression }, { cleanup }) => {
    try {
      /**
       * Can only be used with the template tag
       */
      if (el.tagName !== 'TEMPLATE') {
        logWarning('"x-teleport" can only be used with a template tag', expression, el)
        return
      }

      /**
       * The HTML nodes within the template must have a single root node
       */
      if (el.content.children.length > 1) {
        logWarning('"x-teleport" contents must have a single root node', expression, el)
        return
      }

      /**
       * We want a top level node within the teleport template. Multiple
       * children are not allowed
       */
      const clone = el.content.cloneNode(true).firstElementChild

      /**
       * Copy scope for the parent x-data to the cloned node
       */
      addScopeToNode(clone, {}, el)

      /**
       * If the cloned node doesn't have any x-data attribute, then we must
       * define one. This is required to make x-ref work. X-ref looks for
       * the closest root element with "x-data" attribute.
       */
      if (!clone.hasAttribute('x-data')) {
        clone.setAttribute('x-data', '')
      }

      /**
       * Find the closest root for the cloned node
       * and use its refs by reference
       */
      const root = $alpine.closestRoot(el)
      if (!root._x_refs) {
        root._x_refs = {}
      }
      clone._x_refs = root._x_refs

      /**
       * Wrap DOM mutations inside the "mutateDom" callback. x-if
       * uses it as well and I have just copied it from there
       */
      $alpine.mutateDom(() => {
        const target = document.querySelector(expression)

        /**
         * Ensure the target DOM node exists
         */
        if (!target) {
          logWarning('"x-teleport" cannot locate the target DOM node', expression, el)
          clone.remove()
          return
        }

        target.appendChild(clone)
        $alpine.initTree(clone)
      })

      /**
       * Remove the node during cleanup
       */
      cleanup(() => {
        clone.remove()
      })
    } catch (error) {
      logWarning(`"x-teleport": ${error.message}`, expression, el)
    }
  })
}
