'use strict';

ExecuteOrDelayUntilScriptLoaded(initializePage, "sp.js");

function initializePage()
{
    var context = SP.ClientContext.get_current();
    var user = context.get_web().get_currentUser();

    // This code runs when the DOM is ready and creates a context object which is needed to use the SharePoint object model
    $(document).ready(function () {
        getUserName();
    });

    // This function prepares, loads, and then executes a SharePoint query to get the current users information
    function getUserName() {
        context.load(user);
        context.executeQueryAsync(onGetUserNameSuccess, onGetUserNameFail);
    }

    // This function is executed if the above call is successful
    // It replaces the contents of the 'message' element with the user name
    function onGetUserNameSuccess() {
        $('#message').text('Hello ' + user.get_title());
    }

    // This function is executed if the above call fails
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


    function svcTodoItems($http) {

        var url = "../_api/web/lists/GetByTitle('TodoItems')/items";    ///_api/web/lists/GetByTitle('TodoItems')/items?$select=ID,Title,OData__Comments
        var authToken = null;

        return {
            getItems: getItems,
            addItem: addItem,
            token: token

        }

        function getItems() {
            var urlItems = url + '?$select=ID,Title,OData__Comments';                   
            var request = $http({
                method: 'GET',
                url: url,
                headers: {
                    'Content-Type': 'application/json;odata=verbose',
                    'Accept': 'application/json;odata=verbose'
                }
            });

            return request;
        }

        function addItem(item) {

            var data = {
                "__metadata": {
                    "type": "SP.Data.TodoItemsListItem"
                },
                "Title": item.title,
                "OData__Comments": item.comments,
                "Area": item.area
            }

            var request = $http({
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

        function token() {
                      
            var url = "../_api/contextinfo";

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
    }



    function ctrlTodoItems($svcTodo) {
        var ctrl = this;
        ctrl.list = null;

        $svcTodo.token();

        ctrl.getListItems = function () {
          
            $svcTodo.getItems().then(function (res) {

                ctrl.list = res.data.d.results;                                

            }, function (res) {

               erroHandler(res);

            });

        }

        ctrl.addItem = function(){
            $svcTodo.addItem(ctrl.item).then(function (res) {

                ctrl.item = {};
                ctrl.getListItems();                
            }, function (res) {
                erroHandler(res);
            });       
           
        }
       
        function erroHandler(err) {
            console.log(err);
        }

        
        ctrl.getListItems();

    }


})();