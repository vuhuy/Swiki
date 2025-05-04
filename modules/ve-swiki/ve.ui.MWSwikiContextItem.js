/*!
 * VisualEditor MWSwikiContextItem class.
 *
 * @copyright See AUTHORS.txt
 */

/**
 * Context item for a swiki node.
 *
 * @class
 * @extends ve.ui.LinearContextItem
 *
 * @constructor
 * @param {ve.ui.LinearContext} context Context the item is in
 * @param {ve.dm.Model} model Model the item is related to
 * @param {Object} config Configuration options
 */
ve.ui.MWSwikiContextItem = function VeUiMWSwikiContextItem() {
	// Parent constructor
	ve.ui.MWSwikiContextItem.super.apply( this, arguments );

	// DOM changes
	this.$element.addClass( 've-ui-mwSwikiContextItem' );
};

/* Inheritance */

OO.inheritClass( ve.ui.MWSwikiContextItem, ve.ui.LinearContextItem );

/* Static Properties */

ve.ui.MWSwikiContextItem.static.name = 'swiki';

ve.ui.MWSwikiContextItem.static.icon = 'swiki';

ve.ui.MWSwikiContextItem.static.label = OO.ui.deferMsg( 'swiki-ve-mwswikidialog-title' );

ve.ui.MWSwikiContextItem.static.modelClasses = [ ve.dm.MWSwikiNode ];

ve.ui.MWSwikiContextItem.static.embeddable = false;

ve.ui.MWSwikiContextItem.static.commandName = 'swiki';

/* Methods */

/**
 * @inheritdoc
 */
ve.ui.MWSwikiContextItem.prototype.getDescription = function () {
	const url = ve.getProp( this.model.getAttribute( 'mw' ), 'attrs', 'url' );
	const urls = ve.getProp( this.model.getAttribute( 'mw' ), 'attrs', 'urls' );
	const spec = ve.getProp( this.model.getAttribute( 'mw' ), 'body', 'extsrc' );

	// Swagger UI priority: inline, urls, url.
	if ( spec && spec.trim() !== '' )
		return spec;

	if ( urls )
		return urls;

	if ( url )
		return url;

	return '{}';
};

/* Registration */

ve.ui.contextItemFactory.register( ve.ui.MWSwikiContextItem );
