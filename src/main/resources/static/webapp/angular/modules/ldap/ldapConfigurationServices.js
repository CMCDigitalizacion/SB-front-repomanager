angular
    .module('O2DigitalSite')
    .service('ldapServices', ldapServices)

function ldapServices($http) {

    var service = {
        getLDAPConfigurations: getLDAPConfigurations,
        updateLdapConfiguration: updateLdapConfiguration,
        saveLdapConfiguration: saveLdapConfiguration,
        saveCombinations: saveCombinations,
        deleteLDAP: deleteLDAP
    };
    return service;

    function getLDAPConfigurations(idDomain) {
        return $http({
            method: 'GET',
            url: 'services/ldap/configurations/' + idDomain,
        });
    }

    function deleteLDAP(ldap, idDomain) {
        return $http({
            method: 'DELETE',
            url: 'services/ldap/delete/' + idDomain + '/' + ldap.ldapuuid
        });
    }

    function updateLdapConfiguration(ldap, idDomain) {
        return $http({
            method: 'POST',
            url: 'services/ldap/update/' + idDomain + '/' + ldap.ldapuuid,
            data: JSON.stringify(ldap)
        });
    }

    function saveLdapConfiguration(ldap, idDomain) {
        return $http({
            method: 'POST',
            url: 'services/ldap/create/' + idDomain,
            data: JSON.stringify(ldap)
        });
    }

    function saveCombinations(ldapUuids, idDomain) {
        return $http({
            method: 'POST',
            url: 'services/ldap/save/combinations/' + idDomain,
            data: JSON.stringify(ldapUuids)
        });
    }
}