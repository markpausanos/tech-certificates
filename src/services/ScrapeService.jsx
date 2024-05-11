import axios from "axios";

const URL_VGI =
	"https://techcertificate20240511005554.azurewebsites.net/api/Scrape/VGI";
const URL_MAINS =
	"https://techcertificate20240511005554.azurewebsites.net/api/Scrape/Mains";
const URL_ACCA =
	"https://techcertificate20240511005554.azurewebsites.net/api/Scrape/ACCA";
const URL_SkillC =
	"https://techcertificate20240511005554.azurewebsites.net/api/Scrape/SkillC";
const URL_EscoSSN =
	"https://techcertificate20240511005554.azurewebsites.net/api/Scrape/EscoSSN";
const URL_EscoCert =
	"https://techcertificate20240511005554.azurewebsites.net/api/Scrape/EscoCert";
const URL_EPA608 =
	"https://techcertificate20240511005554.azurewebsites.net/api/Scrape/EPA608";
const URL_Save =
	"https://techcertificate20240511005554.azurewebsites.net/api/Scrape/Save";

export const ScrapeService = {
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
	retrieveMains: async (
		firstName = "",
		lastName = "",
		city = "",
		state = "",
		zipCode = ""
	) => {
		try {
			const response = await axios.get(
				`${URL_MAINS}?firstName=${firstName}&lastName=${lastName}&city=${city}&state=${state}&zipCode=${zipCode}`
			);

			return response;
		} catch (error) {
			console.error(error);
		}
	},
	retrieveACCA: async (firstName = "", lastName = "") => {
		try {
			const response = await axios.get(
				`${URL_ACCA}?firstName=${firstName}&lastName=${lastName}`
			);

			return response;
		} catch (error) {
			console.error(error);
		}
	},
	retrieveSkillC: async (code = "") => {
		try {
			const response = await axios.get(`${URL_SkillC}?code=${code}`);

			return response;
		} catch (error) {
			console.error(error);
		}
	},
	retrieveEscoSSN: async (firstName = "", lastName = "", SSN = "") => {
		try {
			const response = await axios.get(
				`${URL_EscoSSN}?firstName=${firstName}&lastName=${lastName}&SSN=${SSN}`
			);

			return response;
		} catch (error) {
			console.error(error);
		}
	},
	retrieveEscoCert: async (firstName = "", lastName = "", certNumber = "") => {
		try {
			const response = await axios.get(
				`${URL_EscoCert}?firstName=${firstName}&lastName=${lastName}&certNumber=${certNumber}`
			);

			return response;
		} catch (error) {
			console.error(error);
		}
	},
	retrieveEPA608: async (
		firstName = "",
		lastName = "",
		birthday = "",
		certNumber = "",
		phoneNumber = ""
	) => {
		try {
			const response = await axios.get(
				`${URL_EPA608}?firstName=${firstName}&lastName=${lastName}&birthday=${birthday}&certNumber=${certNumber}&phoneNumber=${phoneNumber}`
			);

			return response;
		} catch (error) {
			console.error(error);
		}
	},
	saveData: async (data) => {
		try {
			const response = await axios.post(URL_Save, data);

			return response;
		} catch (error) {
			console.error(error);
		}
	},
};
