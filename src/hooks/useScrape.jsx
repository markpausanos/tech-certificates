import { useState } from "react";
import { ScrapeService } from "../services/ScrapeService";

export const useScrape = () => {
	const [isScraping, setIsScraping] = useState(false);
	const [scrapedData, setScrapedData] = useState([]);
	const [error, setError] = useState(null);

	const scrapeData = async (userData) => {
		setIsScraping(true);

		try {
			const dataVGI = await ScrapeService.retrieveVGI(
				userData["FirstName"],
				userData["LastName"]
			);

			const dataMains = await ScrapeService.retrieveMains(
				userData["FirstName"],
				userData["LastName"],
				userData["City"],
				userData["State"],
				userData["ZipCode"]
			);

			const dataACCA = await ScrapeService.retrieveACCA(
				userData["FirstName"],
				userData["LastName"]
			);

			const dataSkillC = await ScrapeService.retrieveSkillC(
				userData["CertificateNumber"]
			);

			const dataEscoSSN = await ScrapeService.retrieveEscoSSN(
				userData["FirstName"],
				userData["LastName"],
				userData["SSN"]
			);

			const scrapedData = [
				{
					...dataVGI.data,
					...dataMains.data,
					...dataACCA.data,
					...dataSkillC.data,
					...dataEscoSSN.data,
				},
			];

			setScrapedData(scrapedData);
			setError(null);
			console.log(scrapedData);
		} catch (error) {
			setError(error.message);
		}

		setIsScraping(false);
	};

	return { isScraping, scrapedData, error, scrapeData };
};
