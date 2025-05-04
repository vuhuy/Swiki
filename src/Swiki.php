<?php
namespace MediaWiki\Extension\Swiki;

use MediaWiki\Hook\ParserFirstCallInitHook;
use MediaWiki\MediaWikiServices;
use Html;
use Parser;
use PPFrame;

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

		$config = MediaWikiServices::getInstance()->getMainConfig();
		if ( $config->get( 'SwikiEnableSwaggerDocHook' ) )
			$parser->setHook( 'SwaggerDoc', [ $this, 'renderSwaggerDocTag' ] );
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
		return $this->renderTag( $in, $param, false );
	}

	/**
	 * Render SwaggerUI with the provided Swagger or OpenAPI specification from a SwaggerDoc tag.
	 * @param string|null $in
	 * @param string[] $param
	 * @param Parser $parser
	 * @param PPFrame $frame
	 * @return string
	 */
	public function renderSwaggerDocTag( $in, array $param, Parser $parser, PPFrame $frame ) {
		$parser->getOutput()->addModules( [ 'ext.swiki.init' ] );

		// Follow SwaggerDoc parsing algorithm.
		// See https://github.com/Griboedow/SwaggerDoc/blob/8ed8f8ea68d397e053b9aebc924133722ee844ed/SwaggerDoc.hooks.php.
		if ( isset( $param['specurl'] ) || isset( $param['specUrl'] ) )
			$param['url'] = isset( $param['specurl'] ) ? $param['specurl'] : $param['specUrl'];

		if ( isset( $param['specurls'] ) || isset( $param['specUrls'] ) ) {
			$urls = isset( $param['specurls'] ) ? $param['specurls'] : $param['specUrls'];
			$urls = str_replace( '\'', '"', $urls);
			$json = json_decode( $urls, true );

			if ( $json !== null && $json !== true && $json !== false && json_last_error() === JSON_ERROR_NONE ) {
				$parts = [];
				foreach ($json as $item) {
					if ( !isset ( $item['url'] ) || !isset( $item['name'] ) )
						continue;

					$parts[] = $item['url'];
					$parts[] = $item['name'];
				}

				if ( count($parts) > 1)
					$param['urls'] = implode( '|', $parts );
			}
		}

		return $this->renderTag( $in, $param, true );
	}

	/**
	 * Build the tag that renders Swagger UI.
	 * Todo: 
	 * @param string|null $in
	 * @param string[] $param
	 * @param bool $forceStandalone
	 * @return string
	 */
	private function renderTag( $in, array $param, bool $forceStandalone ) {
		$config = MediaWikiServices::getInstance()->getMainConfig();
		$forceColorScheme = $config->get( 'SwikiForceColorScheme' );
		$validatorUrl = $config->get( 'SwikiValidatorUrl' );

		$attributes = [
			'id' => 'swagger-ui-' . mt_rand(),
			'data-color-scheme' => in_array( $forceColorScheme, [ 'light', 'dark' ] ) ? $forceColorScheme : 'auto',
		];

		if ( $validatorUrl )
			$attributes['data-validator-url'] = $validatorUrl;

		if ( isset( $param['standalone'] ) || $forceStandalone )
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
