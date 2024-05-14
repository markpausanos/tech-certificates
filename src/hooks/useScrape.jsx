/* eslint-disable no-mixed-spaces-and-tabs */
import { useState } from "react";
import { ScrapeService } from "../services/ScrapeService";

export const useScrape = () => {
	const [isScraping, setIsScraping] = useState(false);
	const [scrapedData, setScrapedData] = useState([]);
	const [error, setError] = useState(null);

	const scrapeData = async (userData) => {
		setIsScraping(true);

		try {
			if (
				(userData["FirstName"] === "" || userData["LastName"] === "") &&
				userData["City"] === "" &&
				userData["State"] === "" &&
				userData["ZipCode"] === "" &&
				userData["CertificateNumber"] === "" &&
				userData["SSN"] === "" &&
				userData["Birthdate"] === "" &&
				userData["Phone"] === ""
			) {
				throw new Error(
					"Fill in the the First Name and Last Name fields or the Certificate Number field only."
				);
			}

			const dataVGI =
				userData["FirstName"] !== "" || userData["LastName"] !== ""
					? await ScrapeService.retrieveVGI(
							userData["FirstName"],
							userData["LastName"]
					  )
					: {};

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

			console.log(dataMains.data);

			const dataACCA =
				userData["FirstName"] !== "" || userData["LastName"] !== ""
					? await ScrapeService.retrieveACCA(
							userData["FirstName"],
							userData["LastName"]
					  )
					: {};

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

			const scrapedData = [
				{ ...(dataVGI.data || {}) },
				{ ...(dataMains.data || {}) },
				{ ...(dataACCA.data || {}) },
				{ ...(dataSkillC.data || {}) },
				{ ...(dataEscoSSN.data || {}) },
				{ ...(dataEscoCert.data || {}) },
			].filter((item) => Object.keys(item).length > 0);

			console.log(scrapedData);

			setScrapedData(scrapedData);

			if (scrapedData.length === 0) {
				throw new Error("No data found.");
			}

			if (scrapedData.length > 0) {
				const finalScrapedData = Object.values(scrapedData[0]);

				const isSaved = await ScrapeService.saveData(finalScrapedData);
				if (!isSaved) {
					throw new Error("Failed to save data.");
				}
			}

			setError(null);
		} catch (error) {
			if (error.message === "Failed to save data.") {
				setError("Failed to save data.");
			} else if (error.message === "No data found.") {
				setError("No data found.");
			} else if (
				error.message ===
				"Fill in the the First Name and Last Name fields or the Certificate Number field only."
			) {
				setError(
					"Fill in the the First Name and Last Name fields or the Certificate Number field only."
				);
			} else {
				setError("Something went wrong. Please try again.");
			}
		}

		setIsScraping(false);
	};

	return { isScraping, scrapedData, error, scrapeData };
};
