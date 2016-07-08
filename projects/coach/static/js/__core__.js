require.config({
});
define( [
	'./pages/' + document.getElementsByTagName( 'body' )[0].getAttribute( 'data-page' ) + '/__init__'
], function( page ) {
    document.onload = page.init();
});