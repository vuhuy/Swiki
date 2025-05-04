/*!
 * VisualEditor ContentEditable MWSwikiNode class.
 *
 * @copyright See AUTHORS.txt
 * @license The MIT License (MIT); see LICENSE.txt
 */

/**
 * ContentEditable MediaWiki swiki node.
 *
 * @class
 * @extends ve.ce.MWInlineExtensionNode
 *
 * @constructor
 * @param {ve.dm.MWSwikiNode} model Model to observe
 * @param {Object} [config] Configuration options
 */
ve.ce.MWSwikiNode = function VeCeMWSwikiNode() {
	// Parent constructor
	ve.ce.MWSwikiNode.super.apply( this, arguments );
};

/* Inheritance */

OO.inheritClass( ve.ce.MWSwikiNode, ve.ce.MWInlineExtensionNode );

/* Static properties */

ve.ce.MWSwikiNode.static.name = 'mwSwiki';

ve.ce.MWSwikiNode.static.primaryCommandName = 'swiki';

ve.ce.MWSwikiNode.static.iconWhenInvisible = 'swiki';

ve.ce.MWSwikiNode.static.rendersEmpty = true;

/* Methods */

/**
 * @inheritdoc
 */
ve.ce.MWSwikiNode.prototype.onSetup = function () {
	// Parent method
	ve.ce.MWSwikiNode.super.prototype.onSetup.call( this );
};

/* Registration */

ve.ce.nodeFactory.register( ve.ce.MWSwikiNode );
