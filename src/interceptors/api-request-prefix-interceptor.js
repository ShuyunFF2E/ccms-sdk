/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-10-12
 */

const NON_STATIC_FILE = /^(?!.*\.\w*(\?.*)?$).+$/;
const isDynamicRequest = url => NON_STATIC_FILE.test(url);
const isLocalRequest = url => !/^(http|https):\/\//.test(url);

let apiRequestPrefix = '';
export function setApiRequestPrefix(prefix) {
	apiRequestPrefix = prefix;
}

export default {

	request(config) {

		const url = config.url;
		if (isLocalRequest(url) && isDynamicRequest(url)) {
			config.url = apiRequestPrefix + url;
		}

		return config;
	}
};
