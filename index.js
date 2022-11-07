#!/usr/bin/env node

/**
 * validate-app-cli
 * Validate RSS feed and Sitemap of staging and production apps
 *
 * @author saad <https://twitter.com/msaaddev>
 */

const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');
const rss = require('./utils/rss');
const sitemap = require('./utils/sitemap');

const input = cli.input;
const flags = cli.flags;
const { clear, debug } = flags;

(async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);
	input.includes(`rss`) && (await rss(flags));
	input.includes(`sitemap`) && (await sitemap(flags));

	debug && log(flags);
})();