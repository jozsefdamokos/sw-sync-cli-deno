# Shopware Import/Export CLI tool using Deno

This project is a **Deno** application that exports data from Shopware.

The script:
1. Accepts the base API URL, API key, and API secret as command-line arguments.
2. Authenticates via an authorization endpoint using the provided credentials.
3. Retrieves a Bearer token and uses it to fetch data from the main API endpoint.
4. Saves the data in `output.csv` as a CSV file.

## Prerequisites

Ensure that you have **Deno** installed. You can install Deno by following the instructions on the [official Deno site](https://deno.land/#installation).

## Usage

First create an integration in Shopware to use for the credentials.

The application takes three command-line arguments:

* BASE_API_URL: The base URL of the API (e.g., http://localhos:8000)
* API_KEY: Copy from integration
* API_SECRET: Copy from integration

### Running the Application

To run the application, use the following command format:

```
deno run --allow-net --allow-read --allow-write main.ts BASE_API_URL API_KEY API_SECRET
```

Replace BASE_API_URL, API_KEY, and API_SECRET with actual values for your API.

### Example Output

After successful execution, you will find an output.csv file in the directory, containing the data retrieved from the API.

## Compiling (Optional)

Deno allows you to compile your TypeScript/JavaScript code into an executable binary for easier distribution. You can compile this project into an executable as follows:

```
deno compile --allow-net --allow-read --allow-write main.ts
```

### Running the Compiled Binary

To run the compiled binary, use the following command format:

```
./EXECUTABLE_NAME BASE_API_URL API_KEY API_SECRET
```

This command does not require deno run or specific permissions since they are built into the binary.
