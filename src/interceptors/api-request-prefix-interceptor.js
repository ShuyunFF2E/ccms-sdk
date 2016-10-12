/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-10-12
 */

const NON_STATIC_FILE = /^(?!.*\.\w*(\?.*)?$).+$/;
const isDynamicRequest = url => NON_STATIC_FILE.test(url);

let apiRequestPrefix = '';
export function setApiRequestPrefix(prefix) {
	apiRequestPrefix = prefix;
}

export default {

	request(config) {

		if (isDynamicRequest(config.url)) {
			config.url = apiRequestPrefix + config.url;
		}

		return config;
	}
};
