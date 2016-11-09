goog.provide('Blockly.***')
goog.require('Blockly.***')

## goog.userAgent
goog.userAgent.MOBILE
goog.userAgent.IPHONE
goog.userAgent.ANDROID
goog.userAgent.IPAD
goog.userAgent.WEBKIT
goog.userAgent.isVersionOrHigher('minimalVersion')

## Misc
goog.inherits(inheritedClass, baseClass)
goog.isFunction(functionName)
goog.isArray(arrayName)
anArray.sort(goog.string.caseInsensitiveCompare)    // sort with case insensitive

## goog.asserts
goog.asserts.assert(assertToBeTrue, stringAsErrorMessage)
goog.asserts.assertObject(object)
goog.asserts.fail(failureReason)

## goog.dom
goog.dom.createDom('elementName', {attributeName:attributeValue}, optText)
goog.dom.removeNode(nodeObject)
goog.dom.removeChildren(parentDomObject) // empty element
goog.dom.getElement(elementID)
goog.dom.getViewportSize()
goog.dom.contains(document, child)  // return true when document contains the child
goog.dom.insertSiblingAfter(

## goog.style
goog.style.getBounds(element)

## goog.math
goog.math.Coordinate(TBD) // Coordinate object
goog.math.toDegrees(radianValue)
goog.math.toRadians(degreeValue)

## goog.date
date = new goog.date.Date().toIsoString(true)

## goog.events
goog.event.listen(target,eventName,callbackFunction)
goog.event.unlistenByKey(key)
goog.events.BrowserFeature.TOUCH_ENABLED

## goog.i18n

## goog.Timer
goog.Timer.callOnce(callbackFunction, delayMillSeconds, optHandler)
