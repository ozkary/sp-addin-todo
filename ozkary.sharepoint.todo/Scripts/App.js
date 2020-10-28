'use strict';

/**
 * Copyright 2018 ozkary.com   
 * https://www.ozkary.com/ by Oscar Garcia
 * Licensed under the MIT license. Please see LICENSE for more information.
 * @file simple SharePoint add-in
 * @fileoverview demo of SharePoint OData API to manage a data list
 * @author  0garcia @ozkary
 *
 */

ExecuteOrDelayUntilScriptLoaded(initializePage, "sp.js");

/**
 * initialize the page using the SP Client Object Model which is a wrapper for the OData API
 * */
function initializePage()
{
    const context = SP.ClientContext.get_current();
    const web = context.get_web();
    const user = web.get_currentUser();

    // This code runs when the DOM is ready and creates a context object which is needed to use the SharePoint object model
    $(document).ready(function () {
        try {
            getUserName();
            setAppLogo();
        }
        catch (err) {
            console.error(err);
        }
       
    });

    // This function prepares, loads, and then executes a SharePoint query to get the current users information
    function getUserName() {
        context.load(user);
        context.executeQueryAsync(onGetUserNameSuccess, onGetUserNameFail);
    }

    // This function prepares, loads, and then executes a SharePoint query to set the app logo override which can also be done via master pages
    function setAppLogo() {

        context.load(web);
        context.executeQueryAsync(() => {

            const url = web.get_url() + '/Images/logo.png';
            web.set_siteLogoUrl(url);
            web.update();

            context.executeQueryAsync(null, (sender, args) => {
                alert('Failed to set logo. Error:' + args.get_message());
            });

        });
        
    }

    // This function is executed when the user is loaded
    // It replaces the contents of the 'message' element with the user name
    function onGetUserNameSuccess() {
        $('#message').text('Hello ' + user.get_title());
    }

    // This function is executed when the user call fails
    function onGetUserNameFail(sender, args) {
        alert('Failed to get user name. Error:' + args.get_message());
    }
}


(function(){

    "use strict";

    var appName = 'office.app';
    var app = angular.module(appName,[]);

    app.factory("cmp.svc.todoitems", ['$http',svcTodoItems]);

    app.component("todoList", {
        controller: ['cmp.svc.todoitems',ctrlTodoItems]
        , templateUrl: 'cmp.vw.todoitems.html', controllerAs: "ctrl"
    });


    /**
     * Service object to handle the SP OData API calls
     * @param {object} $http
     */
    function svcTodoItems($http) {

        // tenant relative Url to the host webapp space         
        const url = "../_api/web/lists/GetByTitle('TodoItems')/items";    ///_api/web/lists/GetByTitle('TodoItems')/items?$select=ID,Title,OData__Comments       
        let authToken = null;
       
        /**
         * Gets the area choices
         * */
        const getAreas = () => {
            const urlArea = url.replace('items', 'fields');
            const query = urlArea + "?$select=Choices&$filter=EntityPropertyName eq 'Area' ";
            const request = $http({
                method: 'GET',
                url: query,
                headers: {
                    'Content-Type': 'application/json;odata=verbose',
                    'Accept': 'application/json;odata=verbose'
                }
            });

            return request;
        }


        /**
         * Gets the items in the list
         * */
        const getItems = ()  =>{
            const query = url + '?$select=ID,Title,Area,OData__Comments';                   
            const request = $http({
                method: 'GET',
                url: query,
                headers: {
                    'Content-Type': 'application/json;odata=verbose',
                    'Accept': 'application/json;odata=verbose'
                }
            });

            return request;
        }

        /**
         * Adds a new item to the list
         * @param {object} item
         */
        const addItem = (item) => {

            const data = {
                "__metadata": {
                    "type": "SP.Data.TodoItemsListItem"
                },
                "Title": item.title,
                "OData__Comments": item.comments,
                "Area": item.area
            }

            const request = $http({
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/json;odata=verbose',
                    'Accept': 'application/json;odata=verbose',
                    'X-RequestDigest': authToken.value
                },
                data: JSON.stringify(data)
            });

            return request;
        } 

        /**
         * gets the security token
         * */
        const token = () => {
                      
            const url = "../_api/contextinfo";

            $http({
                method: 'POST',
                url: url,
                headers: {
                    'Content-Type': 'application/json;odata=verbose',
                    'Accept': 'application/json;odata=verbose'
                }
            }).then(function success(resp) {
                var data = resp.data.d.GetContextWebInformation;                
                authToken = {};
                authToken.name = 'X-RequestDigest';
                authToken.value = data['FormDigestValue'];
                
            }, function error(resp) {
                console.log(resp);
            });            
            
        }

        // Service APIs
        return {
            getItems: getItems,
            addItem: addItem,
            getAreas: getAreas,
            token: token
        }
    }


    /**
     * Controller function
     * @param {objecr} $svcTodo inject service to manage SP API
     */
    function ctrlTodoItems($svcTodo) {
        var ctrl = this;
        ctrl.list = null;
        ctrl.areas = ['Architecture','Design/Analysis','Documentation'];

        // load the token to set the sec context
        $svcTodo.token();
     
        /**
         * Loads the items
         * */
        ctrl.getAreaItems = () => {
            let areas = [];

            try {
                const resp = $svcTodo.getAreas();
                if (resp) {
                    resp.then((res) => {
                        ctrl.areas = res.data.d.results[0].Choices.results;
                    });
                    
                }
            }
            catch (err) {
                erroHandler(err);
            }    
        
        }

        /**
         * Loads the items
         * */
        ctrl.getListItems = function () {
          
            $svcTodo.getItems().then(function (res) {

                ctrl.list = res.data.d.results;                                

            }, function (res) {

               erroHandler(res);

            });

        }

        /**
         * Adds a new items
         * */
        ctrl.addItem = function(){
            $svcTodo.addItem(ctrl.item).then(function (res) {

                ctrl.item = {};
                ctrl.getListItems();                
            }, function (res) {
                erroHandler(res);
            });       
           
        }

        /**
         * Simple error handler
         * @param {object} err  current exception
         */
        const erroHandler = (err) =>{
            console.log(err);
        }

        // load the area options
        ctrl.getAreaItems();

        // loads the items from the list
        ctrl.getListItems();

    }


})();
