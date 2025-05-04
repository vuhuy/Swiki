php maintenance/run.php install.php \
    --dbname=mediawiki \
    --dbserver=database \
    --installdbuser=mediawiki \
    --installdbpass=mediawiki1234 \
    --dbuser=mediawiki \
    --dbpass=mediawiki1234 \
    --server='http://localhost:8080' \
    --scriptpath='' \
    --lang=en \
    --pass=mediawiki1234 \
    'Swikipedia' 'Swiki' &&
echo "wfLoadExtension( 'Swiki' );" >> LocalSettings.php  &&
echo "\$wgSwikiEnableSwaggerDocHook = true;" >> LocalSettings.php &&
echo "\$wgRateLimits = [];" >> LocalSettings.php &&
apachectl graceful &&
php maintenance/run.php edit.php --conf LocalSettings.php Control < extensions/Swiki/tests/data/Control.html &&
php maintenance/run.php edit.php --conf LocalSettings.php SwaggerDoc_Invalid_Urls < extensions/Swiki/tests/data/SwaggerDoc_Invalid_Urls.html &&
php maintenance/run.php edit.php --conf LocalSettings.php SwaggerDoc_Valid_Url < extensions/Swiki/tests/data/SwaggerDoc_Valid_Url.html &&
php maintenance/run.php edit.php --conf LocalSettings.php SwaggerDoc_Valid_Urls < extensions/Swiki/tests/data/SwaggerDoc_Valid_Urls.html &&
php maintenance/run.php edit.php --conf LocalSettings.php Swiki_Invalid_Inline < extensions/Swiki/tests/data/Swiki_Invalid_Inline.html &&
php maintenance/run.php edit.php --conf LocalSettings.php Swiki_Invalid_Urls < extensions/Swiki/tests/data/Swiki_Invalid_Urls.html &&
php maintenance/run.php edit.php --conf LocalSettings.php Swiki_Valid_Inline < extensions/Swiki/tests/data/Swiki_Valid_Inline.html &&
php maintenance/run.php edit.php --conf LocalSettings.php Swiki_Valid_Url_Standalone < extensions/Swiki/tests/data/Swiki_Valid_Url_Standalone.html &&
php maintenance/run.php edit.php --conf LocalSettings.php Swiki_Valid_Url < extensions/Swiki/tests/data/Swiki_Valid_Url.html &&
php maintenance/run.php edit.php --conf LocalSettings.php Swiki_Valid_Urls < extensions/Swiki/tests/data/Swiki_Valid_Urls.html