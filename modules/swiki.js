mw.loader.using('mediawiki.util', () => {
	// Propagate color scheme preferences to Swagger UI.
	let currentTheme = 'skin-theme-clientpref-day';

	const colorSchemeClasses = [
	  'skin-theme-clientpref-os',
	  'skin-theme-clientpref-day',
	  'skin-theme-clientpref-night'
	];

	const getActiveTheme = () => {
		for (const cls of colorSchemeClasses) {
			if (document.documentElement.classList.contains(cls)) return cls;
		}
		return 'skin-theme-clientpref-day';
	};

	const applyColorScheme = (theme) => {
		document.querySelectorAll('.mw-ext-swiki-container').forEach((container, _) => {
			if (container.classList.contains('mw-ext-swiki-manual-color-scheme')) return;

			const swagger = container.shadowRoot?.querySelector('.swagger-container');
			if (!swagger) return;

			if (theme === 'skin-theme-clientpref-night')
				swagger.classList.add('swagger-ui-dark');
			else if (theme === 'skin-theme-clientpref-day')
				swagger.classList.remove('swagger-ui-dark');
			else if(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
				swagger.classList.add('swagger-ui-dark');
			else
				swagger.classList.remove('swagger-ui-dark');
		});
	};
	  
	const observer = new MutationObserver((mutationsList) => {
		for (const mutation of mutationsList) {
			if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
				const activeTheme = getActiveTheme();
				if (activeTheme !== currentTheme) {
					currentTheme = activeTheme;
					applyColorScheme(currentTheme, false);
				}
			}
		}
	});

	applyColorScheme(getActiveTheme());
	observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

	// Render Swagger UI using shadow DOM in all Swiki containers.
	document.querySelectorAll('.mw-ext-swiki-render').forEach((container, _) => {
		const url = container.getAttribute('data-url');
		const urls = container.getAttribute('data-urls');
		const spec = container.getAttribute('data-spec');
		const standalone = container.getAttribute('data-standalone');
		const scheme = container.getAttribute('data-color-scheme');
		const validator = container.getAttribute('data-validator-url');

		// Set up shadow DOM.
		const style = document.createElement('link');
		style.setAttribute('rel', 'stylesheet');
		style.setAttribute('href', '/load.php?modules=ext.swiki.swaggerui.styles&only=styles');

		const swagger = document.createElement('div');
		swagger.className = 'swagger-container';
		if (scheme === 'light' || scheme === 'dark') {
			container.classList.add('mw-ext-swiki-manual-color-scheme');

			if (scheme === 'dark')
				swagger.classList.add('swagger-ui-dark');
		}

		const shadow = container.attachShadow({ mode: 'open' });
		shadow.appendChild(style);
		shadow.appendChild(swagger);

		// Build Swagger UI config.
		let cfg = {
			domNode: swagger,
			deepLinking: true,
			presets: [window.SwaggerUIBundle.presets.apis],
			plugins: [window.SwaggerUIBundle.plugins.DownloadUrl]
		}

		if (validator)
			cfg['validatorUrl'] = validator;
		else
			cfg['validatorUrl'] = null;

		if (spec && spec.trim() !== '') {
			try {
				cfg['spec'] = JSON.parse(spec);
			} catch {
				cfg['spec'] = '{}';
			}
		} else if (urls && urls.trim() !== '') {
			const parts = urls.split('|');
			if (parts.length % 2 !== 0 || parts.length === 0) {
				cfg['spec'] = '{}';
			} else {
				cfg['urls'] = [];
				for (let i = 0; i < parts.length; i += 2) {
					cfg['urls'].push({
						url: parts[i],
						name: parts[i + 1]
					});
				}
			}
		} else if (url && url.trim() !== '') {
			cfg['url'] = url; 
		} else {
			cfg['spec'] = '{}';
		}

		if (standalone === '1' || cfg['urls']) {
			cfg['presets'].push(window.SwaggerUIStandalonePreset);
			cfg['layout'] = 'StandaloneLayout';
		}

		SwaggerUIBundle(cfg);
		container.classList.add('mw-ext-swiki-rendered');
	});
});
