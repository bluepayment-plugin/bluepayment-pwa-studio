const moduleOverridePlugin = require('./moduleOverrideWebpackPlugin');
const componentOverrideMapping = require('./componentOverrideMapping');

/**
 * Custom intercept file for the extension
 * By default you can only use target of @magento/pwa-buildpack.
 *
 * If do want extend @magento/peregrine or @magento/venia-ui
 * you should add them to peerDependencies to your package.json
 *
 * If you want to add overwrites for @magento/venia-ui components you can use
 * moduleOverrideWebpackPlugin and componentOverrideMapping
 */
module.exports = targets => {
    targets.of('@magento/pwa-buildpack').specialFeatures.tap(flags => {
        /**
         *  Wee need to activated esModules and cssModules to allow build pack to load our extension
         * {@link https://magento.github.io/pwa-studio/pwa-buildpack/reference/configure-webpack/#special-flags}.
         */
        flags[targets.name] = {
            esModules: true,
            cssModules: true,
            graphqlQueries: true,
            i18n: true
        };
    });

    targets.of('@magento/pwa-buildpack').webpackCompiler.tap(compiler => {
        // registers our own overwrite plugin for webpack
        new moduleOverridePlugin(componentOverrideMapping).apply(compiler);
    })


    targets.of('@magento/venia-ui').checkoutPagePaymentTypes.tap(payments =>
        payments.add({
            paymentCode: 'bluepayment',
            importPath: '@bluemedia/bluepayment-pwa/src/components/bluepayment.js'
        })
    );

    targets.of('@magento/venia-ui').routes.tap(routes => {
        routes.push({
            name: 'BluePaymentPage',
            pattern: '/bluepayment',
            path: '@bluemedia/bluepayment-pwa/src/components/BluePaymentPage/'
        });

        return routes;
    });
};
