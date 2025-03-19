import ballerina/http;
import ballerinax/health.fhir.r4 as r4;
import ballerinax/health.fhir.r4.parser;

isolated ExplanationOfBenefit[] eobs = [];
isolated int createEOBNextId = 9000;

public isolated function create(json payload) returns r4:FHIRError|ExplanationOfBenefit {
    ExplanationOfBenefit|error eob = parser:parse(payload).ensureType();
    if eob is error {
        return r4:createFHIRError(eob.message(), r4:ERROR, r4:INVALID, httpStatusCode = http:STATUS_BAD_REQUEST);
    } else {
        lock {
            createEOBNextId += 1;
            eob.id = (createEOBNextId).toBalString();
        }
        lock {
            eobs.push(eob.clone());
        }
        return eob;
    }
}

public isolated function getById(string id) returns r4:FHIRError|ExplanationOfBenefit {
    lock {
        foreach var item in eobs {
            if item.id == id {
                return item.clone();
            }
        }
    }
    return r4:createFHIRError(string `Cannot find an EOB resource with id: ${id}`, r4:ERROR, r4:INVALID, httpStatusCode = http:STATUS_NOT_FOUND);
}

public isolated function search(map<string[]>? searchParameters = ()) returns r4:FHIRError|r4:Bundle {
    r4:Bundle bundle = {
        'type: "collection"
    };
    if (searchParameters is map<string[]>) {
        foreach var key in searchParameters.keys() {
            match key {
                "_id" => {
                    ExplanationOfBenefit byId = check getById(searchParameters.get(key)[0]);
                    bundle.entry = [
                        {
                            'resource: byId
                        }
                    ];
                    return bundle;
                }
                _ => {
                    return r4:createFHIRError(string `Not supported search parameter: ${key}`, r4:ERROR, r4:INVALID, httpStatusCode = http:STATUS_NOT_IMPLEMENTED);
                }
            }
        }
    }
    lock {
        r4:BundleEntry[] bundleEntries = [];
        foreach var item in eobs {
            r4:BundleEntry bundleEntry = {
                'resource: item
            };
            bundleEntries.push(bundleEntry);
        }
        r4:Bundle cloneBundle = bundle.clone();
        cloneBundle.entry = bundleEntries;
        return cloneBundle.clone();
    }
}
