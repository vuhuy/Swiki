<?php
namespace MediaWiki\Extension\Swiki;

use MediaWiki\Html\Html;
use MediaWiki\Hook\ParserFirstCallInitHook;
use MediaWiki\Parser\Parser;
use MediaWiki\Parser\PPFrame;
use MediaWiki\MediaWikiServices;

/**
 * This class handles rendering SwaggerUI in WikiText.
 *
 * @license MIT
 * @author Vuhuy Luu <git@shibe.nl>
 */
class Swiki implements ParserFirstCallInitHook {
	/**
	 * This hook is called when the parser initialises for the first time.
	 * @param Parser $parser
	 */
	public function onParserFirstCallInit( $parser ) {
		$parser->setHook( 'swiki', [ $this, 'renderSwikiTag' ] );
	}

	/**
	 * Render SwaggerUI with the provided Swagger or OpenAPI specification from a Swiki tag.
	 * @param string|null $in
	 * @param string[] $param
	 * @param Parser $parser
	 * @param PPFrame $frame
	 * @return string
	 */
	public function renderSwikiTag( $in, array $param, Parser $parser, PPFrame $frame ) {
		$parser->getOutput()->addModules( [ 'ext.swiki.init' ] );
		$config = MediaWikiServices::getInstance()->getMainConfig();
		$forceColorScheme = $config->get( 'SwikiForceColorScheme' );
		$validatorUrl = $config->get( 'SwikiValidatorUrl' );

		$attributes = [
			'id' => 'swagger-ui-' . mt_rand(),
			'data-color-scheme' => in_array( $forceColorScheme, [ 'light', 'dark' ] ) ? $forceColorScheme : 'auto',
		];

		if ( $validatorUrl )
			$attributes['data-validator-url'] = $validatorUrl;

		if ( isset( $param['standalone'] ) )
			$attributes['data-standalone'] = '1';

		if ( $in )
			$attributes['data-spec'] = $in;

		if ( isset( $param['urls'] ) )
			$attributes['data-urls'] = $param['urls'];

		if ( isset( $param['url'] ) && trim( $param['url'] ) !== '' )
			$attributes['data-url'] = trim( $param['url'] );

		// Follow Swagger UI parsing algorithm.
		// See https://swagger.io/docs/open-source-tools/swagger-ui/usage/configuration/.
		$hasError = false;
		$content = '';

		if ( $in && trim( $in ) !== '' ) {
			$json = json_decode( $in, true );
			if ( $json === null || $json === true || $json === false || json_last_error() !== JSON_ERROR_NONE || empty( $json ) ) {
				$hasError = true;
				$error = wfMessage( 'swiki-invalid-spec' )->text();
			}
		} elseif ( isset( $param['urls'] ) && trim( $param['urls'] ) !== '' ) {
			$parts = array_map( 'trim', explode( '|', $param['urls'] ) );
			if ( count( $parts ) % 2 !== 0 || count( $parts ) === 0 ) {
				$hasError = true;
				$error = wfMessage( 'swiki-invalid-urls' )->text();
			}
		} elseif ( !isset( $param['url'] ) || trim( $param['url'] ) === '' ) {
			$hasError = true;
			$error = wfMessage( 'swiki-missing-spec' )->text();
		}

		$attributes['class'] = $hasError
			? 'mw-ext-swiki-container mw-ext-swiki-error'
			: 'mw-ext-swiki-container mw-ext-swiki-render';

		if ( $hasError ) {
			return Html::rawElement( 'div', $attributes, $error );
		}

		return Html::rawElement( 'div', $attributes );
	}
}
