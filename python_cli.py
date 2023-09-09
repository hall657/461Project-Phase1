import argparse
import requests
import json
import ndjson
import sys
import re
import subprocess

NPM_URL_PREFIX = "https://www.npmjs.com/package/"
GITHUB_URL_PREFIX = "https://github.com/"
LGPL_LICENSE_TEXT = "GNU Lesser General Public License v2.1"

# Function to fetch package information from npmjs.com
def get_npm_info(package_name):
    # Construct the URL for the npm package by appending the package name to the NPM_URL_PREFIX.
    npm_url = NPM_URL_PREFIX + package_name
    
    # Send an HTTP GET request to the npm URL.
    response = requests.get(npm_url)

    # Check if the request was successful (HTTP status code 200).
    if response.status_code == 200:
        # Return the response text, which contains package details in HTML format.
        return response.text
    else:
        # If the request was not successful, return None to indicate failure.
        return None

# Function to fetch package information from GitHub
def get_github_info(repository_url):
    # Construct the URL for the GitHub repository by appending the repository URL to GITHUB_URL_PREFIX.
    github_url = GITHUB_URL_PREFIX + repository_url
    
    # Send an HTTP GET request to the GitHub URL.
    response = requests.get(github_url)

    # Check if the request was successful (HTTP status code 200).
    if response.status_code == 200:
        # Return the response text, which contains repository details in HTML format.
        return response.text
    else:
    # If the request was not successful, return None to indicate failure.
        return None

# Function to calculate scores based on criteria
def calculate_scores(package_name, repository_url):
    ramp_up_score = 0.0
    correctness_score = 0.0
    bus_factor_score = 0.0
    responsiveness_score = 0.0
    license_score = 0.0

    # Fetch package information from npm and GitHub based on provided package name and repository URL.
    npm_info = get_npm_info(package_name)
    github_info = get_github_info(repository_url)


    #### TO DO ####
    # Add scoring logic here
    # ...

    return {
        "URL": package_name,
        "NetScore": (ramp_up_score + correctness_score + bus_factor_score +
                     responsiveness_score + license_score) / 5.0,
        "RampUp": ramp_up_score,
        "Correctness": correctness_score,
        "BusFactor": bus_factor_score,
        "ResponsiveMaintainer": responsiveness_score,
        "License": license_score
    }

# Function to run the tool
def run_tool(url_file_path):
    # Read the URL file and split it into a list of URLs.
    with open(url_file_path, 'r') as file:
        urls = file.read().splitlines()

    results = []

    # check urls
    for url in urls:
        parts = url.split('/')
        if len(parts) == 5 and parts[3] == "package":
            package_name = parts[4]
            repository_url = ""
        elif len(parts) == 5 and parts[3] == "github.com":
            package_name = ""
            repository_url = parts[4]
        else:
            print(f"Invalid URL: {url}")
            continue

        # Calculate scores for the package based on its name and repository URL.
        scores = calculate_scores(package_name, repository_url)
        results.append(scores)

    # Output results in NDJSON format
    with open("output.ndjson", 'w', newline='') as file:
        ndjson.dump(results, file)

def main():
    parser = argparse.ArgumentParser(description="ACME Module Evaluation Tool")
    parser.add_argument("command", choices=["install", "test"])
    parser.add_argument("--url-file", help="Path to the file containing URLs", required=False)

    args = parser.parse_args()

    # Install dependencies (placeholder)
        #### You can customize this part to install any necessary dependencies ####
    if args.command == "install":
        subprocess.run(["pip", "install", "--user", "requests"])

    # Run test suite (placeholder)
        #### You can customize this part to run your test suite ####
    elif args.command == "test":
        print("Running test suite... ")

    # Run URL_FILE 
    if args.url_file:
        run_tool(args.url_file)
    else:
        print("Missing URL file. Usage: ./run URL_FILE")

if __name__ == "__main__":
    main()
