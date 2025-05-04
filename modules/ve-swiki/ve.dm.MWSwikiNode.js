/*!
 * VisualEditor DataModel MWSwikiNode class.
 *
 * @copyright See AUTHORS.txt
 * @license The MIT License (MIT); see LICENSE.txt
 */

/**
 * DataModel MediaWiki swiki node.
 *
 * @class
 * @extends ve.dm.MWInlineExtensionNode
 *
 * @constructor
 * @param {Object} [element]
 */
ve.dm.MWSwikiNode = function VeDmMWSwikiNode() {
	// Parent constructor
	ve.dm.MWSwikiNode.super.apply( this, arguments );
};

/* Inheritance */

OO.inheritClass( ve.dm.MWSwikiNode, ve.dm.MWInlineExtensionNode );

/* Static members */

ve.dm.MWSwikiNode.static.name = 'mwSwiki';

ve.dm.MWSwikiNode.static.tagName = 'div';

ve.dm.MWSwikiNode.static.extensionName = 'swiki';

/* Registration */

ve.dm.modelRegistry.register( ve.dm.MWSwikiNode );
