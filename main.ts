import { writeCSV } from "https://deno.land/x/csv@v0.8.0/mod.ts";
import { ensureFile } from "https://deno.land/std@0.106.0/fs/mod.ts";

const [baseApiUrl, apiKey, apiSecret] = Deno.args;

const AUTH_URL = `${baseApiUrl}/api/oauth/token`;
const API_URL = `${baseApiUrl}/api/search/product`;

const profile = {
    mappings: [
        {
            fileColumn: 'product_number',
            entityPath: 'productNumber',
        },
        {
            fileColumn: 'name',
            entityPath: 'name',
        },
        {
            fileColumn: 'stock',
            entityPath: 'stock',
        },
    ],
}

async function getAuthToken() {
    try {
        const response = await fetch(AUTH_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                grant_type: "client_credentials",
                client_id: apiKey,
                client_secret: apiSecret,
            }),
        });

        if (!response.ok) {
            throw new Error(`Failed to authenticate: ${response.statusText}`);
        }

        const data = await response.json();

        return data.access_token;
    } catch (error) {
        console.error("Error fetching auth token:", error);

        return null;
    }
}

async function fetchData(token: string) {
    try {
        const headers = new Headers();
        headers.set("Authorization", `Bearer ${token}`);

        const response = await fetch(API_URL, {
            method: "POST",
            headers: headers,
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch data: ${response.statusText}`);
        }

        const data = await response.json();

        return data.data;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function jsonToCSV(data: any[], filePath: string) {
    await ensureFile(filePath);

    const csvColumns = profile.mappings.map((mapping) => mapping.fileColumn);
    const csvData = data.map((item) => {
        return profile.mappings.map((mapping) => item.attributes[mapping.entityPath]);
    });

    const file = await Deno.open(filePath, { write: true, truncate: true });
    await writeCSV(file, [csvColumns, ...csvData]);

    file.close();
}

async function main() {
    if (!baseApiUrl || !apiKey || !apiSecret) {
        console.log("Please provide the base API URL, API key, and API secret.");
        return;
    }

    const token = await getAuthToken();
    if (!token) {
        console.log("Failed to retrieve auth token.");
        return;
    }

    const data = await fetchData(token);
    if (data) {
        const filePath = "./export.csv";
        await jsonToCSV(data, filePath);
        console.log(`Data has been written to ${filePath}`);
    } else {
        console.log("No data to write to CSV.");
    }
}

main();