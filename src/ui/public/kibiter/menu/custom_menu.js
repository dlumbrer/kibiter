
export function customMenu($scope) {
    // Define the number of columns
    let numberColumns = 4

    $scope.showInfo = function (item) {
        if (item.type === "entry") {
            redirectToPanel($scope, item)
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

    const redirectToPanel = ($scope, item) => {
        $scope.showNewMenu = false;
        window.location.replace(window.location.href.split("#")[0] + "#/dashboard/" + item.panel_id)
    }
}