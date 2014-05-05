/*
* Returns the client which makes calls to Amazon Products Advertising service.
*   accessKey, secretAccessKey - found in the account management portal
*   associateTag - found in the email after registering in the Amazon Associates program. Used to send you money after purchase.
*   options:
*       host - service host. Default is "ecs.amazonaws.com"
*       path - service path. Default is "/onca/xml"
*       region - default is US
*       version - the Amazon api version
* */
exports.initialize = function(accessKey, secretAccessKey, associateTag, options){
    var aws = require("aws-lib");

    var prodAdv = aws.createProdAdvClient(accessKey, secretAccessKey, associateTag, options);

    var itemSearch = function(query, callback){
        prodAdv.call("ItemSearch", query, callback);
    };

    var similarityLookup = function(query, callback){
        prodAdv.call("SimilarityLookup", query, callback);
    };

    var itemLookup = function(query, callback){
        prodAdv.call("ItemLookup", query, callback);
    };

    var cartCreate = function(query, callback){
        prodAdv.call("CartCreate", query, callback);
    };

    var cartAdd = function(query, callback){
        prodAdv.call("CartAdd", query, callback);
    };

    var cartModify = function(query, callback){
        prodAdv.call("CartModify", query, callback);
    };

    var cartClear = function(query, callback){
        prodAdv.call("CartClear", query, callback);
    };

    var cartGet = function(query, callback){
        prodAdv.call("CartGet", query, callback);
    };

    var browseNodeLookup = function(query, callback){
        prodAdv.call("BrowseNodeLookup", query, callback);
    };

    return {
        searchItems: itemSearch,
        itemDetails: itemLookup,
        getSimilarItems: similarityLookup,
        browseNodeDetails: browseNodeLookup,
        shoppingCartOperations: {
            create: cartCreate,
            add: cartAdd,
            modify: cartModify,
            get: cartGet,
            clear: cartClear
        }
    };
};