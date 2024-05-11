import axios from "axios";

const URL_VGI =
	"https://techcertificate20240511005554.azurewebsites.net/api/Scrape/VGI";

export const TestService = {
	retrieveVGI: async (firstName = "", lastName = "") => {
		try {
			const response = await axios.get(
				`${URL_VGI}?firstName=${firstName}&lastName=${lastName}`
			);

			return response;
		} catch (error) {
			console.error(error);
		}
	},
};
