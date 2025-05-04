/*!
 * VisualEditor UserInterface MWSwikiDialogTool class.
 *
 * @copyright See AUTHORS.txt
 * @license The MIT License (MIT); see LICENSE.txt
 */

/**
 * MediaWiki UserInterface swiki tool.
 *
 * @class
 * @extends ve.ui.FragmentDialogTool
 * 
 * @constructor
 * @param {OO.ui.ToolGroup} toolGroup
 * @param {Object} [config] Configuration options
 */

ve.ui.MWSwikiDialogTool = function VeUiMWSwikiDialogTool( toolGroup, config ) {
	ve.ui.MWSwikiDialogTool.super.call( this, toolGroup, config );
};

OO.inheritClass( ve.ui.MWSwikiDialogTool, ve.ui.FragmentWindowTool );
ve.ui.MWSwikiDialogTool.static.name = 'swiki';
ve.ui.MWSwikiDialogTool.static.group = 'object';
ve.ui.MWSwikiDialogTool.static.icon = 'swiki';
ve.ui.MWSwikiDialogTool.static.title = OO.ui.deferMsg( 'swiki-ve-mwswikidialog-title' );
ve.ui.MWSwikiDialogTool.static.modelClasses = [ ve.dm.MWSwikiNode ];
ve.ui.MWSwikiDialogTool.static.commandName = 'swiki';
ve.ui.toolFactory.register( ve.ui.MWSwikiDialogTool );

/* Registration */

ve.ui.commandRegistry.register(
	new ve.ui.Command(
		'swiki', 'window', 'open',
		{ args: [ 'swiki' ], supportedSelections: [ 'linear' ] }
	)
);

ve.ui.sequenceRegistry.register(
	new ve.ui.Sequence( 'wikitextSwiki', 'swiki', '<swiki', 6 )
);

ve.ui.commandHelpRegistry.register( 'insert', 'swiki', {
	sequences: [ 'wikitextSwiki' ],
	label: OO.ui.deferMsg( 'swiki-ve-mwswikidialog-title' )
} );
