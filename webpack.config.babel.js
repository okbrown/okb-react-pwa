import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackPwaManifest from 'webpack-pwa-manifest';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import WorkboxPlugin from 'workbox-webpack-plugin';

const port = process.env.PORT || 5000;

module.exports = {
	entry: './src/app.js',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			{
				test: /\.(js)$/,
				exclude: /node_modules/,
				use: [ 'babel-loader' ],
			},
			{
				test: /\.css$/,
				use: [
					{
						loader: 'style-loader',
					},
					{
						loader: 'css-loader',
						options: {
							modules: true,
							camelCase: true,
							sourceMap: true,
						},
					},
				],
			},
		],
	},
	plugins: [
		new CleanWebpackPlugin([ 'dist' ]),

		new HtmlWebpackPlugin({
			title: 'PRWP',
			meta: { viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no' },
		}),

		new CopyWebpackPlugin([
			{
				from: 'node_modules/idb/lib/idb.js', to: 'db',
			},
			{
				from: 'src/db/index.js', to: 'db',
			}
		]),

		new WebpackPwaManifest({
			name: 'PRWP',
			short_name: 'PRWP',
			description: 'Progressive React Web App Starter Kit',
			background_color: '#ffffff',
			gcm_sender_id: '',
			orientation: "portrait",
			display: "standalone",
			start_url: ".",
			inject: true,
			fingerprints: true,
			ios: false,
			publicPath: null,
			includeDirectory: true,
			icons: [
				{
					src: path.resolve('src/assets/images/icon.png'),
					destination: path.join('icons'),
					sizes: [ 96, 128, 192, 256, 384, 512 ],
				},
				{
					src: path.resolve('src/assets/images/large-icon.png'),
					destination: path.join('icons'),
					size: '1024x1024',
				},
			],
		}),

		new WorkboxPlugin.InjectManifest({
			swSrc: './src/pwa/service-worker.js',
			swDest: './service-worker.js',
			importScripts: [ 'db/index.js', 'db/idb.js' ],
		}),
	],
	devServer: {
		host: 'localhost',
		port: port,
		historyApiFallback: true,
		open: true,
	},
};
