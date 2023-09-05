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

def get_npm_info(package_name):
    npm_url = NPM_URL_PREFIX + package_name
    response = requests.get(npm_url)

    if response.status_code == 200:
        return response.text
    else:
        return None

def get_github_info(repository_url):
    github_url = GITHUB_URL_PREFIX + repository_url
    response = requests.get(github_url)

    if response.status_code == 200:
        return response.text
    else:
        return None

def calculate_scores(package_name, repository_url):
    ramp_up_score = 0.0
    correctness_score = 0.0
    bus_factor_score = 0.0
    responsiveness_score = 0.0
    license_score = 0.0

    npm_info = get_npm_info(package_name)
    github_info = get_github_info(repository_url)


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

def run_tool(url_file_path):
    with open(url_file_path, 'r') as file:
        urls = file.read().splitlines()

    results = []

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

        scores = calculate_scores(package_name, repository_url)
        results.append(scores)

    with open("output.ndjson", 'w', newline='') as file:
        ndjson.dump(results, file)

def main():
    parser = argparse.ArgumentParser(description="ACME Module Evaluation Tool")
    parser.add_argument("command", choices=["install", "test"])
    parser.add_argument("--url-file", help="Path to the file containing URLs", required=False)

    args = parser.parse_args()

    if args.command == "install":
        subprocess.run(["pip", "install", "--user", "requests"])

    elif args.command == "test":
        print("Running test suite... (placeholder)")

    elif args.command == "evaluate":
        if args.url_file:
            run_tool(args.url_file)
        else:
            print("Please provide a URL file using the --url-file option.")

if __name__ == "__main__":
    main()
