
export function customMenu($scope) {
    $scope.showInfo = function (item) {
        if (item.type === "entry") {
            $scope.showNewMenu = false;
            window.location.replace(window.location.href.split("#")[0] + "#/dashboard/" + item.panel_id)
        } else if (item.type === "menu") {
            // If clicked in the same item
            if ($scope.parentDashboard === item) {
                $scope.showNewMenu = false;
                $scope.parentDashboard = undefined;
                return
            }
            $scope.showNewMenu = true;
            $scope.parentDashboard = item;
            // Divide in 4 columns
            let numberColumns = 4
            $scope.currentPanelsons = new Array(numberColumns)
            let countItems = 0;
            item.dashboards.forEach(function (subitem) {
                if (!$scope.currentPanelsons[countItems]){
                    $scope.currentPanelsons[countItems] = []
                }
                $scope.currentPanelsons[countItems].push(subitem)
                if (countItems >= numberColumns-1){
                    countItems = 0;
                    return
                }
                countItems++
            })
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
}