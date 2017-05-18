angular
    .module('O2DigitalSite')
    .service('videoConferenceFilterService', videoConferenceFilterService);

function videoConferenceFilterService($http) {

    var filterVideoConferenceName = 'filterVideoConference';
    var UNDEFINED = 'undefined';

    this.saveVideoconferenceFilter = function (filterObject) {
        sessionStorage.setItem(filterVideoConferenceName, JSON.stringify(filterObject));
    }

    this.getVideoconferenceFilter = function () {
        return JSON.parse(sessionStorage.getItem(filterVideoConferenceName));
    }

    this.isDefinedFilterVideoConference = function () {
        return !angular.isUndefinedOrNull(sessionStorage.getItem(filterVideoConferenceName));
    }

    this.removeFilter = function () {
        sessionStorage.removeItem(filterVideoConferenceName);
        return undefined;
    }

    this.returnCopiedFilter = function (filterToCopy) {

        var filterCopied = angular.copy(filterToCopy);

        if (!angular.isUndefinedOrNull(filterCopied.from)){
            filterCopied.fromFormattedData = moment(filterCopied.from).format('YYYY-MM-DD');
            filterCopied.fromFormatted = filterCopied.fromFormattedData;
        }
        else {
            filterCopied.fromFormattedData = UNDEFINED;
            filterCopied.fromFormatted = UNDEFINED;
        }
        
        if (!angular.isUndefinedOrNull(filterCopied.to)){
            filterCopied.toFormattedData = moment(filterCopied.to).format('YYYY-MM-DD');
            filterCopied.toFormatted = filterCopied.toFormattedData;
        }
        else {
            filterCopied.toFormattedData = UNDEFINED;
            filterCopied.toFormatted = UNDEFINED;
        }
            

        if (angular.isUndefined(filterCopied.agent) || filterCopied.agent.name === '') {
            filterCopied.agent = {}
            filterCopied.agent.name = UNDEFINED;
        }

        if (angular.isUndefined(filterCopied.operationid) || filterCopied.operationid === '')
            filterCopied.operationid = UNDEFINED;

        if (angular.isUndefined(filterCopied.videostate))
            filterCopied.videostate = UNDEFINED;

        return filterCopied;
    }

    this.returnEmptyFilter = function () {
        return { videostate: 'undefined' };
    }

    this.validateDates = function (filterToValidate) {
        if (angular.isDefined(filterToValidate.from) && angular.isDefined(filterToValidate.to)) {
            if (filterToValidate.from > filterToValidate.to)
                return false;
            else
                return true;
        }
        return true;
    }

    this.returnFormattedFilter = function (filterToFormat) {

        var filterToChange = angular.copy(filterToFormat);

        if (!angular.isUndefinedOrNull(filterToChange.from)) {
            filterToChange.from = moment(filterToChange.from).format('YYYY-MM-DD');
            filterToChange.fromFormatted = moment(filterToChange.from).format('YYYY-MM-DD');
        } else {
            filterToChange.from = undefined;
            filterToChange.fromFormatted = UNDEFINED;
        }

        if (!angular.isUndefinedOrNull(filterToChange.to)) {
            filterToChange.to = moment(filterToChange.to).format('YYYY-MM-DD');
            filterToChange.toFormatted = moment(filterToChange.to).format('YYYY-MM-DD');
        } else {
            filterToChange.to = undefined;
            filterToChange.toFormatted = UNDEFINED;
        }

        if (!angular.isUndefinedOrNull(filterToChange.fromFormatted) && filterToChange.fromFormatted !== UNDEFINED) {
            filterToChange.from = moment(filterToChange.fromFormatted).toDate();
        }

        if (!angular.isUndefinedOrNull(filterToChange.toFormatted) && filterToChange.toFormatted !== UNDEFINED) {
            filterToChange.to = moment(filterToChange.toFormatted).toDate();
        }

        if (!angular.isUndefinedOrNull(filterToChange.agent)) {
            if (!angular.isUndefinedOrNull(filterToChange.agent.name) && filterToChange.agent.name === UNDEFINED)
                filterToChange.agent.name = '';
        } else {
            filterToChange.agent = { name: '' };
        }

        if (!angular.isUndefinedOrNull(filterToChange.operationid) && filterToChange.operationid === UNDEFINED) {
            filterToChange.operationid = '';
        }

        return filterToChange;
    }
}