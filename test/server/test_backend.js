/*global describe, it, before, after */

(function() {
    "use strict";

    var assert = require("assert");

    var test_utils = require('./test_utils.js');
    var backend = require(test_utils.SRC_PATH + '/server/backend.js');
    var database = require(test_utils.SRC_PATH + '/server/database.js');
    var mockedData = require('./_mocked-data.js');
    var TEST_DB = test_utils.TEST_DATABASE;

    describe('test_backend', function() {

        before(function(done) {
            database.createDB(TEST_DB, function() {
                database.saveTeam('_testteam', '[4,100]', '[Emeline Landemaine,Emeline Parizel]', function() {
                    database.saveTeam('_testalone', '[4]', '[Emeline Landemaine]', function() {
                        done();
                    });
                });
            });
        });

        after(function(done) {
            database.dropDB(TEST_DB, function() {done();});
        });

        describe('retrieveTeam', function(){
            it('should retrieve two persons for _testteam', function(done) {
                backend.retrieveTeam("_testteam", function(data) {
                    test_utils.assertJsonEqual(data,
                        {"teamname":"_testteam","persons":[{"bib":4,"name":"Emeline Landemaine"},
                        {"bib":100,"name":"Emeline Parizel"}]});
                    done();
                });
            });
            it('should retrieve one person for _testalone', function(done) {
                backend.retrieveTeam("_testalone", function(data) {
                    test_utils.assertJsonEqual(data,
                        {"teamname":"_testalone","persons":[{"bib":4,"name":"Emeline Landemaine"}]});
                    done();
                });
            });
            it('should retrieve 0 person for _testwrong', function(done) {
                backend.retrieveTeam("_testwrong", function(data) {
                    test_utils.assertJsonEqual(data, {"teamname":"_testwrong","persons":[]});
                    done();
                });
            });
        });

        describe('retrieveCheckpoints', function(){
            it('should retrieve three checkpoints for bib 100', function(done) {
                backend.retrieveCheckpoints(100, function(data) {
                    test_utils.assertJsonEqual(data.checkpoints, _testteam.persons[1].checkpoints);
                    done();
                });
            });
            it('should retrieve two checkpoints for bib 4', function(done) {
                backend.retrieveCheckpoints(4, function(data) {
                    test_utils.assertJsonEqual(data.checkpoints, _testteam.persons[0].checkpoints);
                    done();
                });
            });
            it('should retrieve 0 checkpoints for bib 0', function(done) {
                backend.retrieveCheckpoints(0, function(data) {
                    test_utils.assertJsonEqual(data.checkpoints, []);
                    done();
                });
            });
        });

        describe('retrieveTeamCheckpoints', function(){
            it('should retrieve two persons for _testteam', function(done) {
                backend.retrieveTeamCheckpoints("_testteam", function(data) {
                    test_utils.assertJsonEqual(data, _testteam);
                    done();
                });
            });
            it('should retrieve one person for _testalone', function(done) {
                backend.retrieveTeamCheckpoints("_testalone", function(data) {
                    test_utils.assertJsonEqual(data, _testalone);
                    done();
                });
            });
            // it('should raise for _testwrong', function(done) {
            //     try{
            //         backend.retrieveTeamCheckpoints("_testwrong", function() {});
            //     }
            //     catch(err) {
            //         done();
            //     }
            // });
        });
    });

    var _testteam = {
        "teamname": "_testteam",
        "persons": [
            {
                "bib": 4,
                "name": "Emeline Landemaine",
                "checkpoints": [
                    {
                    "time": "21:17:32",
                    "distance": "15.00",
                    "name": "La croix du Bac",
                    "lap": 1
                    },
                    {
                    "time": "04:17:32",
                    "distance": "15.00",
                    "name": "La croix du Bac",
                    "lap": 2
                    }
                ]
            },
            {
                "bib": 100,
                "name": "Emeline Parizel",
                "checkpoints": [
                    {
                    "time": "21:17:32",
                    "distance": "15.00",
                    "name": "La croix du Bac",
                    "lap": 1
                    },
                    {
                    "time": "04:17:32",
                    "distance": "55.00",
                    "name": "La croix du Bac",
                    "lap": 2
                    },
                    {
                    "time": "14:17:32",
                    "distance": "75.00",
                    "name": "La croix du Bac",
                    "lap": 3
                    }
                ]
            }
        ]
    };

    var _testalone = {
        "teamname": "_testalone",
        "persons": [
            {
                "bib": 4,
                "name": "Emeline Landemaine",
                "checkpoints": [
                    {
                    "time": "21:17:32",
                    "distance": "15.00",
                    "name": "La croix du Bac",
                    "lap": 1
                    },
                    {
                    "time": "04:17:32",
                    "distance": "15.00",
                    "name": "La croix du Bac",
                    "lap": 2
                    }
                ]
            }
        ]
    };

}());
