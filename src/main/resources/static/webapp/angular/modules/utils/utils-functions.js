
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(stringBuscada, posicion) {
    posicion = posicion || 0;
    return this.indexOf(stringBuscada, posicion) === posicion;
  };
}

function checkMultiOperationConsistency(signLevels) {
    var isBiometricWithDocs  = false;
    var isSignWithDocs       = false;
    var isBiometricLevel     = true;
    var signTypeSelected     = false;
    var level                = undefined;
    var consistencyOperation = {};



    for (var i = signLevels.length - 1; i >= 0; i--) {

        isBiometricWithDocs = false;
        isSignWithDocs      = false;
        isBiometricLevel    = true;
        signTypeSelected    = false;

        level = signLevels[i];

        signTypeSelected = isSignTypeSelected(level);

        if(!signTypeSelected)
            break;

        isBiometricLevel = levelIsBiometric(level);

        if (isBiometricLevel) {
            for (var i = level.docsTypeList.length - 1; i >= 0; i--) {
                if (level.docsTypeList[i].selected) {
                    isBiometricWithDocs = true;
                    break;
                } 
            }
        } else {
            for (var i = level.docsTypeList.length - 1; i >= 0; i--) {
                if (level.docsTypeList[i].selected) {
                    isSignWithDocs = true;
                    break;
                }
            }
        }

        if(!isBiometricWithDocs || !isSignWithDocs){
            break;
        }
    }

    consistencyOperation.signTypeSelected    = signTypeSelected;
    consistencyOperation.isBiometricWithDocs = isBiometricWithDocs;
    consistencyOperation.isSignWithDocs      = isSignWithDocs;
    consistencyOperation.isBiometricLevel    = isBiometricLevel;

    return consistencyOperation;

}

function checkMultiOperationConsistencyOnCreating(signLevels) {
    var isBiometricWithDocs  = false;
    var isSignWithDocs       = false;
    var isBiometricLevel     = true;
    var level                = undefined;
    var consistencyOperation = {};

    for (var i = signLevels.length - 1; i >= 0; i--) {

        isBiometricWithDocs = false;
        isSignWithDocs      = false;
        isBiometricLevel    = true;

        level = signLevels[i];

        isBiometricLevel = savedLevelIsBiometric(level);

        if (isBiometricLevel && level.docsTypeList.length !== 0) {
            isBiometricWithDocs = true;
            break;
        } else if (level.docsTypeList.length !== 0) {
            isSignWithDocs = true;
            break;
        }

        if(!isBiometricWithDocs || !isSignWithDocs){
            break;
        }
    }

    consistencyOperation.isBiometricWithDocs = isBiometricWithDocs;
    consistencyOperation.isSignWithDocs      = isSignWithDocs;
    consistencyOperation.isBiometricLevel    = isBiometricLevel;

    return consistencyOperation;

}

function levelIsBiometric(level) {
    var levelSignType    = undefined;
    var isBiometricLevel = true;
    
    for (var i = level.signatureTypes.length - 1; i >= 0; i--) {
        levelSignType = level.signatureTypes[i];
        if(levelSignType.label.toUpperCase() !== 'BIOMETRICA' && levelSignType.selected){
            isBiometricLevel = false;
        }
    }

    return isBiometricLevel;
}

function savedLevelIsBiometric(level) {
    var isBiometricLevel = false;

    if(level.signatureTypes.length === 1 && level.signatureTypes[0].label.toUpperCase() === 'BIOMETRICA'){
        isBiometricLevel = true;
    }
    
    return isBiometricLevel;
}

function isSignTypeSelected(level) {
    var levelSignType    = undefined;
    var signTypeSelected = false;
    
    for (var i = level.signatureTypes.length - 1; i >= 0; i--) {
        levelSignType = level.signatureTypes[i];
        if(levelSignType.selected){
            signTypeSelected = true;
        }
    }

    return signTypeSelected;
}