import * as fs from 'fs'
import { GenerateCalculations } from './calculations'
import { logger } from '../logging_cfg';

// object to hold data for each module
export type module = {
    URL: string,
    NET_SCORE: number,
    RAMP_UP_SCORE: number,
    CORRECTNESS_SCORE: number,
    BUS_FACTOR_SCORE: number,    
    RESPONSIVE_MAINTAINER_SCORE: number,
    LICENSE_SCORE: number
}

// read URLs from input into array of strings
// each string in return array will be one URL
// input: file path as string
// output: array of strings
function ReadFile(file: string): string[] {
    logger.log('debug', 'Getting links from file');
    // read file contents
    let URLs: string = fs.readFileSync(file, 'utf-8');
    let URLsList: string[] = URLs.split('\n');
    return URLsList;
}

// find modules with GitHub URLs
// input: array of strings
// output: array of modules for GitHub URLs
function FindGitModules(URLsList: string[]): module[] {
    logger.log('debug', 'Finding GitHub modules');
    let moduleList: module[] = [];
    // find GitHub URLs and create module objects for each
    for(let idx: number = 0; idx < URLsList.length; idx++) {
        if(URLsList[idx].includes("github.com/")) {
            let newModule: module = {URL: URLsList[idx], NET_SCORE: 0, RAMP_UP_SCORE: 0, CORRECTNESS_SCORE: 0,
                                     BUS_FACTOR_SCORE: 0, RESPONSIVE_MAINTAINER_SCORE: 0, LICENSE_SCORE: 0};
            moduleList.push(newModule);
        }
    }

    logger.log('debug', 'GitHub modules found: ' + moduleList.length);
    return moduleList;
}

// find modules with npm URLs
// input: array of strings
// output: array of modules for npm URLs
function FindNPMModules(URLsList: string[]): module[] {
    logger.log('debug', 'Finding NPM modules');
    let moduleList: module[] = [];
    // find npm URLs and create module objects for each
    for(let idx: number = 0; idx < URLsList.length; idx++) {
        if(URLsList[idx].includes("npmjs.com/")) {
            let newModule: module = {URL: URLsList[idx], NET_SCORE: 0, RAMP_UP_SCORE: 0, CORRECTNESS_SCORE: 0,
                                     BUS_FACTOR_SCORE: 0, RESPONSIVE_MAINTAINER_SCORE: 0, LICENSE_SCORE: 0};
            //console.log('\nURL: %s\n', URLsList[idx]);
            moduleList.push(newModule);
        }
    }

    logger.log('debug', 'NPM modules found: ' + moduleList.length);
    return moduleList;
}

// find other URLs
// input: array of strings
// output: array of modules for other URLs
function FindOtherModules(URLsList: string[]): module[] {
    logger.log('debug', 'Finding Other modules');
    let moduleList: module[] = [];
    // find other URLs and create module objects for each
    for(let idx: number = 0; idx < URLsList.length; idx++) {
        if(!(URLsList[idx].includes("npmjs.com/")) && !(URLsList[idx].includes("github.com/"))) {
            let newModule: module = {URL: URLsList[idx], NET_SCORE: 0, RAMP_UP_SCORE: 0, CORRECTNESS_SCORE: 0,
                                     BUS_FACTOR_SCORE: 0, RESPONSIVE_MAINTAINER_SCORE: 0, LICENSE_SCORE: 0};
            moduleList.push(newModule);
        }
    }
    
    logger.log('debug', 'Other modules found: ' + moduleList.length);
    return moduleList;
}

// generate output
// input: module
// prints NDJSON output to stdout
export function GenerateOutput(currModule: module) {
    logger.log('debug', 'Generating output for link: ' + currModule.URL);
    console.log(JSON.stringify(currModule) + '\n');
}

// primary function for handling input, output and calculations
// input: string with URL_FILE location
// output: error or NDJSON to stdout
export function URLFileHandler(file: string) {
    logger.log('info', 'Entered fileio.ts');
    // check for file existing
    if(!fs.existsSync(file)) {
        // needs to be changed to logging
        logger.log('info', 'Error: file does not exist at provided path');
        return 1;
    }

    // split file into array of strings
    let URLsList: string[] = ReadFile(file);

    // create array of modules for each link type
    logger.log('info', 'Dividing modules by link type');
    let gitModuleList: module[] = FindGitModules(URLsList);
    let npmModuleList: module[] = FindNPMModules(URLsList);
    let otherModuleList: module[] = FindOtherModules(URLsList);

    // complete calculations
    // generate output as each calculation finishes
    logger.log('info', 'Beginning calculations');
    // git module calculations
    for(let idx: number = 0; idx < gitModuleList.length; idx++) {
        logger.log('debug', 'Sending link to calculations.ts: ' + gitModuleList[idx].URL);
        GenerateCalculations(gitModuleList[idx], false)
    }

    // npm module calculations
    for(let idx: number = 0; idx < npmModuleList.length; idx++) {
        logger.log('debug', 'Sending link to calculations.ts: ' + npmModuleList[idx].URL);
        GenerateCalculations(npmModuleList[idx], true);
    }

    // generate output and print to stdout
    // combine module lists into one for output
    //logger.log('info', 'Calling output generation');
    //let moduleList: module[] = gitModuleList.concat(npmModuleList, otherModuleList);
    //GenerateOutput(moduleList);
}