/*!
 * VisualEditor UserInterface MWSwikiDialog class.
 *
 * @copyright See AUTHORS.txt
 * @license The MIT License (MIT); see LICENSE.txt
 */

/**
 * MediaWiki swiki dialog.
 *
 * @class
 * @extends ve.ui.MWExtensionDialog
 *
 * @constructor
 * @param {Object} [config] Configuration options
 */
ve.ui.MWSwikiDialog = function VeUiMWSwikiDialog( config ) {
	// Parent constructor
	ve.ui.MWSwikiDialog.super.call( this, ve.extendObject( { padded: false }, config ) );
};

/* Inheritance */

OO.inheritClass( ve.ui.MWSwikiDialog, ve.ui.MWExtensionDialog );

/* Static properties */

ve.ui.MWSwikiDialog.static.size = 'large';

ve.ui.MWSwikiDialog.static.name = 'swiki';

ve.ui.MWSwikiDialog.static.title = OO.ui.deferMsg( 'swiki-ve-mwswikidialog-title' );

ve.ui.MWSwikiDialog.static.modelClasses = [ ve.dm.MWSwikiNode ];

ve.ui.MWSwikiDialog.static.dir = 'ltr';

ve.ui.MWSwikiDialog.static.allowedEmpty  = true;

ve.ui.MWSwikiDialog.static.selfCloseEmptyBody = true;

/* Methods */

/**
 * @inheritdoc
 */
ve.ui.MWSwikiDialog.prototype.initialize = function () {
	// Parent method
	ve.ui.MWSwikiDialog.super.prototype.initialize.call( this );

	// Index layout
	this.panel = new OO.ui.PanelLayout( {
		padded: true,
		scrollable: false,
		expanded: false
	} );

	// Text inputs
	this.input = new ve.ui.MWAceEditorWidget( {
		placeholder: "{}",
		rows: 8
	} );
	this.input.setLanguage( 'json' );

	this.urlInput = new OO.ui.TextInputWidget( {
		placeholder: "https://petstore3.swagger.io/api/v3/openapi.json",
	} );
	this.urlsInput= new OO.ui.TextInputWidget( {
		placeholder: '/petstore2.json|Petstore 2|/petstore3.json|Petstore 3',
	} );

	// Checkboxes
	this.standaloneCheckbox = new OO.ui.CheckboxInputWidget();

	// Field layouts
	const inputField = new OO.ui.FieldLayout(this.input, {
		label: ve.msg('swiki-ve-mwswikidialog-spec'),
		align: 'top'
	});
	const urlField = new OO.ui.FieldLayout(this.urlInput, {
		label: ve.msg('swiki-ve-mwswikidialog-url'),
	});
	const urlsField = new OO.ui.FieldLayout(this.urlsInput, {
		label: ve.msg('swiki-ve-mwswikidialog-urls'),
	});
	const standaloneField = new OO.ui.FieldLayout(this.standaloneCheckbox, {
		label: ve.msg('swiki-ve-mwswikidialog-standalone'),
	});

	// Initialization
	this.$content.addClass( 've-ui-mwSwikiDialog-content' );

	this.panel.$element.append(
		inputField.$element,
		urlField.$element,
		urlsField.$element,
		standaloneField.$element
	);
	this.$body.append(
		this.panel.$element
	);
};

/**
 * @inheritdoc
 */
ve.ui.MWSwikiDialog.prototype.getSetupProcess = function ( data ) {
	return ve.ui.MWSwikiDialog.super.prototype.getSetupProcess.call( this, data )
		.next( function () {
			const
				attributes = this.selectedNode ? this.selectedNode.getAttribute( 'mw' ).attrs : {},
				url = attributes.url || null,
				urls = attributes.urls || null,
				standalone = attributes.standalone !== undefined;

			// Populate form
			this.urlInput.setValue( url );
			this.urlsInput.setValue( urls );
			this.standaloneCheckbox.setSelected( standalone );

			// Add event handlers
			this.urlInput.on( 'change', this.onChangeHandler );
			this.urlsInput.on( 'change', this.onChangeHandler );
			this.standaloneCheckbox.on( 'change', this.onChangeHandler );
		}, this )
		.next( function () {
			if ( this.originalMwData === null ) {
				const mwData = this.getNewElement().attributes.mw;
				this.updateMwData( mwData );
				this.originalMwData = mwData;
				this.updateActions();
			}
		}, this );
};

/**
 * @inheritdoc
 */
ve.ui.MWSwikiDialog.prototype.getTeardownProcess = function ( data ) {
	return ve.ui.MWSwikiDialog.super.prototype.getTeardownProcess.call( this, data )
		.first( function () {
			this.urlInput.off( 'change', this.onChangeHandler );
			this.urlsInput.off( 'change', this.onChangeHandler );
			this.standaloneCheckbox.off( 'change', this.onChangeHandler );
		}, this );
};

/**
 * @inheritdoc
 */
ve.ui.MWSwikiDialog.prototype.updateMwData = function ( mwData ) {
	// Parent method
	ve.ui.MWSwikiDialog.super.prototype.updateMwData.call( this, mwData );

	// Get data from dialog
	const url = true && this.urlInput.getValue();
	const urls = true && this.urlsInput.getValue();
	const standalone = this.standaloneCheckbox.isSelected();

	// Update attributes
	mwData.attrs.url = url || undefined;
	mwData.attrs.urls = urls || undefined;
	mwData.attrs.standalone = standalone ? '1' : undefined;
};

/* Registration */

ve.ui.windowFactory.register( ve.ui.MWSwikiDialog );
