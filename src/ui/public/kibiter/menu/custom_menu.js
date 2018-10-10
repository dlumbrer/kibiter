
export function customMenu($scope) {
    // Define the number of columns
    let numberColumns = 4

    $scope.showInfo = function (item) {
        if (item.type === "entry") {
            $scope.redirectToPanel(item.panel_id)
        } else if (item.type === "menu") {
            // If clicked in the same item
            if ($scope.parentDashboard === item) {
                closeSubmenu($scope)
                return
            }
            showSubmenu($scope, item)
        }
    }

    $scope.showDescription = (subitem) => {
        $scope.showDescriptionDiv = true;
        $scope.descriptionTitle = subitem.title;
        $scope.descriptionContent = subitem.description;
    }

    $scope.hideDescription = () => {
        $scope.showDescriptionDiv = false;
    }

    const showSubmenu = ($scope, item) => {
        $scope.showNewMenu = true;
        $scope.parentDashboard = item;
        $scope.currentPanelsons = new Array(numberColumns)
        let countItems = 0;
        item.dashboards.forEach(function (subitem) {
            if (!$scope.currentPanelsons[countItems]) {
                $scope.currentPanelsons[countItems] = []
            }
            $scope.currentPanelsons[countItems].push(subitem)
            if (countItems >= numberColumns - 1) {
                countItems = 0;
                return
            }
            countItems++
        })
    }

    const closeSubmenu = ($scope) => {
        $scope.showNewMenu = false;
        $scope.parentDashboard = undefined;
    }

    $scope.redirectToPanel = (panel_id) => {
        $scope.showNewMenu = false;
        window.location.replace(window.location.href.split("app/")[0] + "app/kibana#/dashboard/" + panel_id)
    }
}