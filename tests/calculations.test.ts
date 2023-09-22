import { module } from '../src/fileio';
import { data, BusFactor, Correctness, RampUp, ResponsiveMaintainer, License, NetScore } from '../src/calculations';

// basic test for BusFactor
// test('BusFactor', () => {
//     let rawData: data = {contrubtorMostPullRequests: 10, totalPullRequests: 100, activeContributors: 20,
//                          totalClosedIssues: 0, totalissues: 0, totalClosedIssuesMonth: 0, totalIssuesMonth: 0,
//                          quickStart: 0, examples: 0, usage: 0, closedIssues: 0, openIssues: 0, licenses: []};
//     expect(BusFactor(rawData)).toBe(0.9);
// });
  
test('BusFactor', () => {
    it('should return 0 if totalPullRequests is 0', () => {
        const rawData: data = {
            contrubtorMostPullRequests: 10,
            totalPullRequests: 0,
            activeContributors: 5,
            totalClosedIssues: 20,
            totalissues: 50,
            totalClosedIssuesMonth: 5,
            totalIssuesMonth: 10,
            quickStart: 1,
            examples: 1,
            usage: 1,
            closedIssues: 5,
            openIssues: 10,
            licenses: ['License1'],
        };

        const result = BusFactor(rawData);

        expect(result).toBe(0);
    });

    it('should calculate bus factor correctly', () => {
        const rawData: data = {
            contrubtorMostPullRequests: 10,
            totalPullRequests: 100,
            activeContributors: 5,
            totalClosedIssues: 20,
            totalissues: 0,
            totalClosedIssuesMonth: 5,
            totalIssuesMonth: 10,
            quickStart: 1,
            examples: 1,
            usage: 1,
            closedIssues: 5,
            openIssues: 10,
            licenses: ['License1'],      
        };
  
        const result = BusFactor(rawData);
  
        expect(result).toBe(0.975);
    });
});
  
test('Correctness', () => {
    it('should return 0 if totalissues is 0', () => {
        const rawData: data = {
            contrubtorMostPullRequests: 10,
            totalPullRequests: 100,
            activeContributors: 5,
            totalClosedIssues: 20,
            totalissues: 0,
            totalClosedIssuesMonth: 5,
            totalIssuesMonth: 10,
            quickStart: 1,
            examples: 1,
            usage: 1,
            closedIssues: 5,
            openIssues: 10,
            licenses: ['License1'],      
        };
  
        const result = Correctness(rawData);
  
        expect(result).toBe(0);
    });
  
    it('should calculate correctness correctly', () => {
        const rawData: data = {
            contrubtorMostPullRequests: 10,
            totalPullRequests: 100,
            activeContributors: 5,
            totalClosedIssues: 20,
            totalissues: 50,
            totalClosedIssuesMonth: 5,
            totalIssuesMonth: 10,
            quickStart: 1,
            examples: 1,
            usage: 1,
            closedIssues: 5,
            openIssues: 10,
            licenses: ['License1'],      
        };
  
        const result = Correctness(rawData);
  
        expect(result).toBe(0.4);
    });
});
  
test('RampUp', () => {
    it('should return 1', () => {
        const rawData: data = {
            contrubtorMostPullRequests: 10,
            totalPullRequests: 100,
            activeContributors: 5,
            totalClosedIssues: 20,
            totalissues: 50,
            totalClosedIssuesMonth: 5,
            totalIssuesMonth: 10,
            quickStart: 1,
            examples: 1,
            usage: 1,
            closedIssues: 5,
            openIssues: 10,
            licenses: ['License1'],
        };
  
        const result = RampUp(rawData);
  
        expect(result).toBe(1);
    });
});
  
test('ResponsiveMaintainer', () => {
    it('should return 1 if openIssues is 0', () => {
        const rawData: data = {
            contrubtorMostPullRequests: 10,
            totalPullRequests: 100,
            activeContributors: 5,
            totalClosedIssues: 20,
            totalissues: 50,
            totalClosedIssuesMonth: 5,
            totalIssuesMonth: 10,
            quickStart: 1,
            examples: 1,
            usage: 1,
            closedIssues: 5,
            openIssues: 0,
            licenses: ['License1'],
        };
  
        const result = ResponsiveMaintainer(rawData);
  
        expect(result).toBe(1);
    });
  
    it('should calculate responsive maintainer correctly', () => {
        const rawData: data = {
            contrubtorMostPullRequests: 10,
            totalPullRequests: 100,
            activeContributors: 5,
            totalClosedIssues: 20,
            totalissues: 0,
            totalClosedIssuesMonth: 5,
            totalIssuesMonth: 10,
            quickStart: 1,
            examples: 1,
            usage: 1,
            closedIssues: 5,
            openIssues: 10,
            licenses: ['License1'],      
        };
  
        const result = ResponsiveMaintainer(rawData);
  
        expect(result).toBe(0.5);
    });
});
  
test('License', () => {
    it('should return 1 if all licenses are "GNU Lesser General Public License, version 2.1"', () => {
        const rawData: data = {
                contrubtorMostPullRequests: 10,
                totalPullRequests: 100,
                activeContributors: 5,
                totalClosedIssues: 20,
                totalissues: 50,
                totalClosedIssuesMonth: 5,
                totalIssuesMonth: 10,
                quickStart: 1,
                examples: 1,
                usage: 1,
                closedIssues: 5,
                openIssues: 10,
                licenses: ['GNU Lesser General Public License, version 2.1', 
                            'GNU Lesser General Public License, version 2.1'],
        };
  
        const result = License(rawData);
  
        expect(result).toBe(1);
    });
  
    it('should return 0 if any license is not "GNU Lesser General Public License, version 2.1"', () => {
      const rawData: data = {
            contrubtorMostPullRequests: 10,
            totalPullRequests: 100,
            activeContributors: 5,
            totalClosedIssues: 20,
            totalissues: 50,
            totalClosedIssuesMonth: 5,
            totalIssuesMonth: 10,
            quickStart: 1,
            examples: 1,
            usage: 1,
            closedIssues: 5,
            openIssues: 10,
            licenses: ['GNU Lesser General Public License, version 2.1', 'MIT License', 'License3'],
        };
  
        const result = License(rawData);
  
        expect(result).toBe(0);
    });
});
  
test('NetScore', () => {
    it('should calculate net score correctly', () => {
        const moduleData: module = {
            URL: 'github.com/example',
            NET_SCORE: 0,
            RAMP_UP_SCORE: 1,
            CORRECTNESS_SCORE: 0.4,
            BUS_FACTOR_SCORE: 0.975,
            RESPONSIVE_MAINTAINER_SCORE: 0.5,
            LICENSE_SCORE: 0,
        };

        const result = NetScore(moduleData);
        expect(result).toBe(0);
    });

    it('should calculate net score correctly', () => {
        const moduleData: module = {
            URL: 'github.com/example',
            NET_SCORE: 0,
            RAMP_UP_SCORE: 1,
            CORRECTNESS_SCORE: 0.4,
            BUS_FACTOR_SCORE: 0.975,
            RESPONSIVE_MAINTAINER_SCORE: 0.5,
            LICENSE_SCORE: 1,
        };

        const result = NetScore(moduleData);
        expect(result).toBe(0.75);
    });
});

  