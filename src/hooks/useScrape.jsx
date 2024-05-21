/* eslint-disable no-mixed-spaces-and-tabs */
import { useState } from "react";
import { ScrapeService } from "../services/ScrapeService";

const initialWebsiteDataCount = {
	VGI: 0,
	Mains: 0,
	ACCA: 0,
	SkillC: 0,
	EscoSSN: 0,
	EscoCert: 0,
};

export const useScrape = () => {
	const [isScraping, setIsScraping] = useState(false);
	const [scrapedData, setScrapedData] = useState([]);
	const [websiteDataCount, setWebsiteDataCount] = useState(
		initialWebsiteDataCount
	);
	const [error, setError] = useState(null);

	const scrapeData = async (userData) => {
		setIsScraping(true);

		try {
			if (
				(userData["FirstName"] === "" || userData["LastName"] === "") &&
				userData["CertificateNumber"] === ""
			) {
				throw new Error(
					"Fill in at least the First Name and Last Name fields or at least the Certificate Number field only."
				);
			}

			const dataVGI =
				userData["FirstName"] !== "" || userData["LastName"] !== ""
					? await ScrapeService.retrieveVGI(
							userData["FirstName"],
							userData["LastName"]
					  )
					: {};

			if (dataVGI && dataVGI.data && dataVGI.length > 20) {
				throw new Error(
					"Found too many results in VGI to save to sheets. Please narrow down your search."
				);
			}

			const dataMains =
				userData["FirstName"] !== "" ||
				userData["LastName"] !== "" ||
				userData["City"] !== "" ||
				userData["State"] !== "" ||
				userData["ZipCode"] !== ""
					? await ScrapeService.retrieveMains(
							userData["FirstName"],
							userData["LastName"],
							userData["City"],
							userData["State"],
							userData["ZipCode"]
					  )
					: {};

			if (dataMains && dataMains.data && dataMains.length > 20) {
				throw new Error(
					"Found too many results in Mains to save to sheets. Please narrow down your search."
				);
			}

			const dataACCA =
				userData["FirstName"] !== "" || userData["LastName"] !== ""
					? await ScrapeService.retrieveACCA(
							userData["FirstName"],
							userData["LastName"]
					  )
					: {};

			if (dataACCA && dataACCA.data && dataACCA.length > 20) {
				throw new Error(
					"Found too many results in ACCA to save to sheets. Please narrow down your search."
				);
			}

			const dataSkillC = userData["CertificateNumber"]
				? await ScrapeService.retrieveSkillC(userData["CertificateNumber"])
				: {};

			const dataEscoSSN =
				userData["FirstName"] !== "" &&
				userData["LastName"] !== "" &&
				userData["SSN"] !== ""
					? await ScrapeService.retrieveEscoSSN(
							userData["FirstName"],
							userData["LastName"],
							userData["SSN"]
					  )
					: {};

			const dataEscoCert =
				userData["FirstName"] !== "" &&
				userData["LastName"] !== "" &&
				userData["CertificateNumber"] !== ""
					? await ScrapeService.retrieveEscoCert(
							userData["FirstName"],
							userData["LastName"],
							userData["CertificateNumber"]
					  )
					: {};

			const dataEPA608 =
				userData["FirstName"] !== "" ||
				userData["LastName"] !== "" ||
				userData["Birthdate"] !== "" ||
				userData["CertificateNumber"] !== "" ||
				userData["Phone"] !== ""
					? await ScrapeService.retrieveEPA608(
							userData["FirstName"],
							userData["LastName"],
							userData["Birthdate"],
							userData["CertificateNumber"],
							userData["Phone"]
					  )
					: {};

			const scrapedData = [
				{ ...(dataVGI.data || {}) },
				{ ...(dataMains.data || {}) },
				{ ...(dataACCA.data || {}) },
				{ ...(dataSkillC.data || {}) },
				{ ...(dataEscoSSN.data || {}) },
				{ ...(dataEscoCert.data || {}) },
			].filter((item) => Object.keys(item).length > 0);

			setScrapedData(scrapedData);

			if (scrapedData.length === 0) {
				throw new Error("No data found.");
			}

			if (scrapedData.length > 0) {
				setWebsiteDataCount({
					VGI: dataVGI && dataVGI.data ? dataVGI.data.length : 0,
					Mains: dataMains && dataMains.data ? dataMains.data.length : 0,
					ACCA: dataACCA && dataACCA.data ? dataACCA.data.length : 0,
					SkillC: dataSkillC && dataSkillC.data ? dataSkillC.data.length : 0,
					EscoSSN:
						dataEscoSSN && dataEscoSSN.data ? dataEscoSSN.data.length : 0,
					EscoCert:
						dataEscoCert && dataEscoCert.data ? dataEscoCert.data.length : 0,
					EPA608: dataEPA608 && dataEPA608.data ? dataEPA608.data.length : 0,
				});

				// cut values to 20 only and only get values
				const finalScrapedData = scrapedData.map((item) => {
					const keys = Object.keys(item);
					const values = Object.values(item);

					const finalValues = values.slice(0, 20);

					return Object.fromEntries(
						keys.map((key, index) => [key, finalValues[index]])
					);
				});

				const finalestData = Object.values(finalScrapedData[0]);

				const isSaved = await ScrapeService.saveData(finalestData);
				if (!isSaved) {
					throw new Error("Failed to save data.");
				}
			}

			setError(null);
		} catch (error) {
			switch (error.message) {
				case "Failed to save data.":
				case "No data found.":
					setError(error.message);
					break;
				case "Fill in at least the First Name and Last Name fields or at least the Certificate Number field only.":
				case error.message.includes("Please narrow down your search."):
					setError(error.message);
					break;
				default:
					setError("Something went wrong. Please try again.");
			}
		}

		setIsScraping(false);
	};

	return { isScraping, scrapedData, error, websiteDataCount, scrapeData };
};
